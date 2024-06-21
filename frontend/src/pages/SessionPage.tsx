import { useEffect, useState } from "react";
import TextSpace from "../components/TextSpace";
import Modal from "../components/Modal";
import { useLocation, useNavigate } from "react-router-dom";
import CodeEditor from "../components/CodeEditor/CodeEditor";
import Chatbox from "../components/Chatbox";

export default function SessionPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [hidden, setHidden] = useState<boolean>(true);
  const [roomId, setRoomId] = useState<string>("");

  const handleLeave = () => {
    // TODO: handle disconnect from websocket and boot other guy out
    navigate("/home");
  };

  useEffect(() => {
    const id = location.pathname.split("/").slice(-1)[0];
    if (id == "") {
      return;
    }
    setRoomId(id);
  }, [location.pathname]);

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
              <path
                d="M353,450a15,15,0,0,1-10.61-4.39L157.5,260.71a15,15,0,0,1,0-21.21L342.39,54.6a15,
              15,0,1,1,21.22,21.21L189.32,250.1,363.61,424.39A15,15,0,0,1,353,450Z"
              />
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
          <Chatbox roomId={roomId} />
        </div>
        <div className="session-section">
          <CodeEditor roomId={roomId} />
        </div>
      </div>
    </>
  );
}
