import React, { useRef, useState } from "react";
import { useEffect } from "react";
import socket from "../../socket";
import styles from "./Chat.module.css";

const Chat = ({users, messages, name, roomId, setMessages}) => {
  const [messageValue, setMessageValue] = useState("");
  const messageRef = useRef(null);

  const onSendMessage = () => {
    socket.emit("ROOM:NEW_MESSAGE", {
      roomId,
      name,
      text: messageValue
    });
    setMessages({ 
      name,
      text: messageValue
    });
    setMessageValue("");
  };

  useEffect(() => {
    messageRef.current.scrollTo(0, 99999);
  }, [messages]);

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.leftItem}>
            <div>
              <div className={styles.text}>
              Online ({users.length}):  
              </div>
              {users.map((name, index) => (
                <div className={styles.buttonUser} key={name + index}>
                  <button className={styles.buttonUserText}>
                    <div className={styles.buttonText} >
                      {name}
                    </div>
                  </button>
                </div>
              ))}
            </div>
            <hr />
            <h4>
              <div>Room: { roomId }</div>
            </h4>
          </div>
          <div className={styles.rightItem}>
            <div ref={messageRef} className={styles.messages}>
              {
                messages.map((message, index) => (
                  <div className={styles.messageBlock} key={name + index}>
                    <div className={styles.messageText}>{ message.text }</div>
                    <div className={styles.user}>{ message.name }</div>
                  </div>
                ))
              }
            </div>
            <hr />
            <form className={styles.form}>
              <textarea
                value={messageValue}
                onChange={e => setMessageValue(e.target.value)}
                className={styles.messageInput}
              >

              </textarea>
              <button type="button" onClick={onSendMessage} className={styles.buttonSend}>
                <div className={styles.sendText}>
                  Send
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;