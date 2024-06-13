import { KeyboardEvent, useContext, useEffect, useRef, useState } from "react";
import { FormInputEvent } from "../types";
import { UserContext } from "../context/UserContext";

type ChatTextObject = {
  username: string;
  text: string;
};

interface ChatboxProps {
  roomId: string;
}
export default function Chatbox(props: ChatboxProps) {
  const { user } = useContext(UserContext);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const socketRef = useRef<null | WebSocket>(null);
  const [chatContent, setChatContent] = useState<ChatTextObject[]>([
    {
      username: "jon",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a diam nisl. Mauris dapibus, neque vitae consectetur cursus, justo ligula sagittis felis, a facilisis ipsum metus in risus. Suspendisse consequat ex et mauris vehicula, dignissim sodales est pretium. Nam ut felis sit amet ipsum ullamcorper rutrum. ",
    },
  ]); // TODO: remove dummy other user text
  const [chatInput, setChatInput] = useState<string>("");

  // functions
  const handleInputChange = (event: FormInputEvent) => {
    event.preventDefault();
    setChatInput(event.target.value);
  };
  const handleSend = () => {
    if (chatInput == "") {
      return;
    }
    const newChatObject: ChatTextObject = {
      username: user.username
        ? user.username
        : (sessionStorage.getItem("user") as string),
      text: chatInput,
    };
    setChatContent([...chatContent, newChatObject]);
    setChatInput("");
    socketRef.current?.send(JSON.stringify(newChatObject));
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // side-effects
  useEffect(() => {
    scrollToBottom();
  }, [chatContent]);
  useEffect(() => {
    if (props.roomId == "") {
      return;
    }
    const socket = new WebSocket(
      `${import.meta.env.VITE_CHATBOX_WS_URL}/chat/${props.roomId}`
    );
    socketRef.current = socket;
    socket.onmessage = (e: MessageEvent) => {
      setChatContent((c) => [...c, JSON.parse(e.data)]);
    };
    return () => {
      socket.close();
    };
  }, [props.roomId]);

  return (
    <div className="session-chatbox">
      <div className="session-chatarea">
        {chatContent.map((value: ChatTextObject, index: number) => {
          if (value.username == user.username) {
            return (
              <div key={index} className="chat-content__current">
                <div className="chat-avatar" />
                <div className="chat-text">{value.text}</div>
              </div>
            );
          } else {
            return (
              <div key={index} className="chat-content__other">
                <div className="chat-text">{value.text}</div>
                <div className="chat-avatar" />
              </div>
            );
          }
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <input
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key == "Enter") {
              handleSend();
            }
          }}
          value={chatInput}
          className="session-chat-input"
          onChange={handleInputChange}
          name="chatInput"
        />
        <button className="chat-send-button" onClick={handleSend}>
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12L3 21L21 12L3 3L6 12ZM6 12L12 12"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
