import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Chat.module.css";
import iconSmile from "../images/smile.svg";
import iconSend from "../images/send.svg";
import EmojiPicker from "emoji-picker-react";
import Messages from "./Messages";

const socket = io.connect("https://socket-chat-server-icid.onrender.com");

const Chat = () => {
  const { search } = useLocation();
  const [params, setParams] = useState({ room: "", user: "" });
  const [state, setState] = useState([]);
  const [message, setMessage] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [users, setUsers] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null); // Создаем useRef для инпута

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);

    socket.emit("join", searchParams);
  }, [search]);

  useEffect(() => {
    socket.on("message", ({ data }) => {
      setState((_state) => [..._state, data]);
    });
  }, []);

  useEffect(() => {
    socket.on("joinRoom", ({ data: { users } }) => {
      setUsers(users.length);
    });
  }, []);

  const leftRoom = () => {
    socket.emit("leftRoom", { params });
    navigate("/");
  };
  const handleChange = ({ target: { value } }) => {
    setMessage(value);
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    inputRef.current.scrollTop = inputRef.current.scrollHeight;
    inputRef.current.focus();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;

    socket.emit("sendMessage", { message, params });
    setMessage("");
    inputRef.current.focus();
  };
  const onEmojiClick = ({ emoji }) => {
    setMessage(`${message} ${emoji}`);
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    inputRef.current.scrollTop = inputRef.current.scrollHeight;
    inputRef.current.focus();
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>room {params.room}</div>
        <div className={styles.users}>{users} users in this room</div>
        <button className={styles.left} onClick={leftRoom}>
          Left the room
        </button>
      </div>
      <div className={styles.messages}>
        <Messages messages={state} name={params.name} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          ref={inputRef}
          value={message}
          onChange={handleChange}
          placeholder="Write a message..."
          autoComplete="off"
          required
        />

        <div className={styles.container}>
          <div className={styles.emoji}>
            <img
              src={iconSmile}
              alt="icon-smile"
              onClick={() => setOpen(!isOpen)}
            />
            {isOpen && (
              <div className={styles.emojies}>
                <EmojiPicker width={250} onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>

          <button
            className={styles.button}
            type="submit"
            onSubmit={handleSubmit}
          >
            <img className={styles.send} src={iconSend} alt="icon-send" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
