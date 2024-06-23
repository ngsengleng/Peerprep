import { useState } from "react";
import DisplayTable from "../components/DisplayTable";
import Modal from "../components/Modal";
import { FormInputEvent } from "../types";
import {
  Config,
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { useNavigate } from "react-router-dom";

const generatorNameConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: "-",
  length: 3,
};

export default function HomePage() {
  const navigate = useNavigate();
  const [isCreateHidden, setIsCreateHidden] = useState<boolean>(true);
  const [isJoinHidden, setIsJoinHidden] = useState<boolean>(true);
  const [hasEmptyRoomName, setHasEmptyRoomName] = useState<boolean>(false);
  const [sessionName, setSessionName] = useState<string>(
    uniqueNamesGenerator(generatorNameConfig)
  );
  const [joinSessionName, setJoinSessionName] = useState<string>("");

  const handleChange = (event: FormInputEvent) => {
    setSessionName(event.target.value);
  };
  const handleJoinNameChange = (event: FormInputEvent) => {
    setJoinSessionName(event.target.value);
  };
  const handleSubmit = () => {
    console.log(sessionName); // TODO: pass to backend websocket to initiate a room
    setIsCreateHidden(true);
    navigate(`/session/${sessionName}`);
  };
  const handleRedirect = () => {
    if (!joinSessionName) {
      setHasEmptyRoomName(true);
      return;
    }
    console.log(joinSessionName); // TODO: check if room exists
    setIsCreateHidden(true);
    navigate(`/session/${joinSessionName}`);
  };
  return (
    <>
      <div className="home-title">
        <h1>Start practicing today!</h1>
      </div>
      <div className="home-button-group">
        <button
          className="home-redirect-button"
          onClick={() => setIsCreateHidden(false)}
        >
          <b>Create a new session</b>
        </button>
        <button
          className="home-redirect-button"
          onClick={() => setIsJoinHidden(false)}
        >
          <b>Join an existing room</b>
        </button>
      </div>
      <DisplayTable
        rawData={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]}
        hasPagination={false}
      />
      <Modal isHidden={isCreateHidden} setHidden={setIsCreateHidden}>
        <h2>Enter your session name</h2>
        <input
          className="home-modal-input"
          placeholder={sessionName}
          value={sessionName}
          onChange={handleChange}
        />
        <button onClick={handleSubmit} className="home-modal-button">
          <b>start session</b>
        </button>
      </Modal>
      <Modal isHidden={isJoinHidden} setHidden={setIsJoinHidden}>
        <h2>Enter your session name</h2>
        <input
          className="home-modal-input"
          value={joinSessionName}
          onChange={handleJoinNameChange}
        />
        {hasEmptyRoomName && (
          <span className="error-text">name cannot be empty</span>
        )}
        <button onClick={handleRedirect} className="home-modal-button">
          <b>join session</b>
        </button>
      </Modal>
    </>
  );
}
