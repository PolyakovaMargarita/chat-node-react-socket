import React, { useEffect, useReducer } from "react";
import EnterBlock from "./components/enterBlock/EnterBlock";
import reducer from "./reducer";
import socket from "./socket";

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    name: null
  });

  const onLogin = (obj) => {
    dispatch({
      type: "JOINED",
      payload: obj
    });
    socket.emit("ROOM:JOIN", obj);
  };

  useEffect(() => {
    socket.on("ROOM:JOINED", users => {
      console.log("new user", users);
    });
  }, []);

  return (
    <div>
      {!state.joined && <EnterBlock onLogin={onLogin} /> }
    </div>
  );
};

export default App;
