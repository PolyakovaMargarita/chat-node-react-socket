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

app.get("/rooms", (req, res) => {
  res.json(rooms);
});

app.post("/rooms", (req, res) => {
  const { roomId, name } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId, new Map([["users", new Map()],
        ["messages", []]])
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
    socket.broadcast.to(roomId).emit("ROOM:JOINED", users);
  });
  console.log("user connected", socket.id);
});

server.listen(8888, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log("Server start");
});
