const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

const rooms = new Map();

app.get("/rooms/:id", (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId) 
    ? 
    {
      users: [...rooms.get(roomId).get("users").values()],
      messages: [...rooms.get(roomId).get("messages").values()]
    } 
    : 
    { users: [], messages: [] };
  res.json(obj);
});

app.post("/rooms", (req, res) => {
  const { roomId, name } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId, 
      new Map(
        [["users", new Map()],
          ["messages", []]]
      )
    );
  }
  //   res.json([...rooms.keys()]);
  res.send();
});

io.on("connection", (socket) => {
  socket.on("ROOM:JOIN", ({ roomId, name }) => {
    socket.join(roomId);
    rooms.get(roomId).get("users").set(socket.id, name);
    const users = [...rooms.get(roomId).get("users").values()];
    socket.broadcast.to(roomId).emit("ROOM:SET_USERS", users);
    console.log("user connected", socket.id);
  });

  socket.on("ROOM:NEW_MESSAGE", ({ roomId, name, text }) => {
    const messages = {
      name: name,
      text: text
    };
    rooms.get(roomId).get("messages").push(messages);
    socket.broadcast.to(roomId).emit("ROOM:NEW_MESSAGE", messages);
  });
  
  socket.on("disconnect", () => {
    rooms.forEach((value, roomId) => {
      if (value.get("users").delete(socket.id)) {
        const users = [...value.get("users").values()];
        socket.broadcast.to(roomId).emit("ROOM:SET_USERS", users);
        console.log("user disconnect", socket.id);
      }
    });
  });


});


server.listen(8888, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log("Server start");
});
