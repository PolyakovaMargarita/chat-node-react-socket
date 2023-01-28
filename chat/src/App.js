import React, { useEffect, useReducer } from "react";
import EnterBlock from "./components/enterBlock/EnterBlock";
import Chat from "./components/chat/Chat";
import reducer from "./reducer";
import socket from "./socket";
import axios from "axios";

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    name: null,
    users: [],
    messages: []
  });

  const onLogin = async (obj) => {
    dispatch({
      type: "JOINED",
      payload: obj
    });
    socket.emit("ROOM:JOIN", obj);
    const { data } = await axios.get(`/rooms/${ obj.roomId }`);
    dispatch({
      type: "SET_DATA",
      payload: data
    });
    // setUsers(data.users);
  };

  const setUsers = (users) => {
    dispatch({
      type: "SET_USERS",
      payload: users
    });
  };

  const setMessages = (messages) => {
    dispatch({
      type: "NEW_MESSAGE",
      payload: messages
    });
  };

  useEffect(() => {
    socket.on("ROOM:SET_USERS", (users) => setUsers(users));
    socket.on("ROOM:NEW_MESSAGE", setMessages);
  }, []);

  window.socket = socket;

  return (
    <div>
      {!state.joined ? <EnterBlock onLogin={onLogin} /> : <Chat {...state} setMessages={setMessages} /> }
    </div>
  );
};

export default App;
