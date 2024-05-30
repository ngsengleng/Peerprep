import { KeyboardEvent, useEffect, useRef, useState } from "react";
import TextSpace from "../components/TextSpace";
import { FormInputEvent } from "../types";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

type ChatTextObject = {
  username: string;
  text: string;
};
// text in this section are just placeholders, will be dynamically built with backend integration
export default function SessionPage() {
  const navigate = useNavigate();
  const username = "me"; // TODO: replace with actual username from context
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [chatContent, setChatContent] = useState<ChatTextObject[]>([
    {
      username: "jon",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a diam nisl. Mauris dapibus, neque vitae consectetur cursus, justo ligula sagittis felis, a facilisis ipsum metus in risus. Suspendisse consequat ex et mauris vehicula, dignissim sodales est pretium. Nam ut felis sit amet ipsum ullamcorper rutrum. ",
    },
  ]); // TODO: remove dummy other user text
  const [chatInput, setChatInput] = useState<string>("");
  const [hidden, setHidden] = useState<boolean>(true);

  const handleInputChange = (event: FormInputEvent) => {
    event.preventDefault();
    setChatInput(event.target.value);
  };
  const handleSend = () => {
    if (chatInput == "") {
      return;
    }
    const newChatObject: ChatTextObject = { username: "me", text: chatInput };
    setChatContent([...chatContent, newChatObject]);
    setChatInput("");
  };
  const handleLeave = () => {
    // TODO: handle disconnect from websocket and boot other guy out
    navigate("/home");
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatContent]);
  return (
    <>
      <div className="session-navbar">
        <button
          className="navbar-button__back"
          onClick={() => setHidden(false)}
        >
          <svg
            height="30px"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title />
            <g data-name="1" id="_1">
              <path d="M353,450a15,15,0,0,1-10.61-4.39L157.5,260.71a15,15,0,0,1,0-21.21L342.39,54.6a15,15,0,1,1,21.22,21.21L189.32,250.1,363.61,424.39A15,15,0,0,1,353,450Z" />
            </g>
          </svg>
          <b>leave</b>
        </button>
      </div>
      <Modal isHidden={hidden} setHidden={setHidden}>
        <h2>Are you sure you want to leave?</h2>
        You have not successfully completed this question
        <div className="leave-button-group">
          <button
            className="leave-button__cancel"
            onClick={() => setHidden(true)}
          >
            Cancel
          </button>
          <button className="leave-button__confirm" onClick={handleLeave}>
            Leave
          </button>
        </div>
      </Modal>
      <div className="session-layout">
        <div className="session-section">
          <div className="session-question-box">
            {/* TODO: this section will be rendered with content from a leetcode html scraper */}
            <b>128. Longest Consecutive Sequence</b>
            <p>
              Given an unsorted array of integers nums, return the length of the
              longest consecutive elements sequence.
            </p>
            <p>You must write an algorithm that runs in O(n) time.</p>
            <TextSpace repetitions={1} />
            <strong>Example 1:</strong>
            <pre>
              Input: nums = [100,4,200,1,3,2]
              <br />
              Output: 4
              <br />
              Explanation: The longest consecutive elements sequence is [1, 2,
              3, 4]. Therefore its length is 4.
            </pre>
            <TextSpace repetitions={1} />
            <strong>Example 2:</strong>
            <pre>
              Input: nums = [0,3,7,2,5,8,4,6,0,1]
              <br />
              Output: 9
            </pre>
            <TextSpace repetitions={1} />
            <strong>Example 3:</strong>
            <pre>
              Input: nums = [0, 0, 0, 0, 0, 1]
              <br />
              Output: 2
            </pre>
            <TextSpace repetitions={1} />
            <strong>Constraints:</strong>
            <ul>
              <li>{"0 <= nums.length <= 10^5"}</li>
              <li>{"-10^9 <= nums[i] <= 10^9"}</li>
            </ul>
          </div>
          <div className="session-chatbox">
            <div className="session-chatarea">
              {chatContent.map((value: ChatTextObject, index: number) => {
                if (value.username == username) {
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
        </div>
        <div className="session-section">this is the right</div>
      </div>
    </>
  );
}
