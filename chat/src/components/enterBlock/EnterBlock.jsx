import React, { useState } from "react";
import styles from "./EnterBlock.module.css";
import axios from "axios";
import socket from "../../socket";

const EnterBlock = ({ onLogin }) => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [isLoadind, setIsLoading] = useState(false);

  const onEnter = async () => {
    if (!roomId || !name) {
      return alert("Not correct data");
    }
    const obj = {
      roomId,
      name
    };
    setIsLoading(true);
    await axios.post("/rooms", obj);
    onLogin(obj);
  };

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <input 
            className={styles.input}
            type="text" placeholder="Room ID" 
            value={roomId} 
            onChange={e => setRoomId(e.target.value)} />
          <input 
            className={styles.input} 
            type="text" placeholder="Your name" 
            value={name} 
            onChange={e => setName(e.target.value)} />
          <div className={styles.buttonItem}>
            <button
              className={styles.button}
              disabled={isLoadind}
              onClick={onEnter}
            >
              {isLoadind ? "Loading..." : "Enter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterBlock;