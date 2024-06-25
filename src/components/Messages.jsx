import React, { useRef, useEffect } from "react";
import styles from "../styles/Messages.module.css";

const Messages = ({ messages, name }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      const lastMessage = messages[messages.length - 1];
      const itIsMe =
        lastMessage.user.name.trim().toLowerCase() ===
        name.trim().toLowerCase();
      if (itIsMe) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, name]);

  return (
    <div className={styles.messages}>
      {messages.map(({ user, message }, index) => {
        const itIsMe =
          user.name.trim().toLowerCase() === name.trim().toLowerCase();
        const className = itIsMe ? styles.me : styles;

        return (
          <div key={index} className={`${styles.message} ${className}`}>
            <span className={styles.user}>{user.name}</span>
            <div className={styles.text}>{message}</div>
          </div>
        );
      })}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default Messages;
