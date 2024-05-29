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

const generatorNameConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: "-",
  length: 3,
};

export default function HomePage() {
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [sessionName, setSessionName] = useState<string>(
    uniqueNamesGenerator(generatorNameConfig)
  );
  const handleChange = (event: FormInputEvent) => {
    setSessionName(event.target.value);
  };
  const handleSubmit = () => {
    console.log(sessionName); // TODO: pass to backend websocket to initiate a room
    setIsHidden(true);
  };
  return (
    <>
      <div className="home-title">
        <h1>Start practicing today!</h1>
      </div>
      <div className="home-button-group">
        <button
          className="home-redirect-button"
          onClick={() => setIsHidden(false)}
        >
          <b>Create a new session</b>
        </button>
        <button className="home-redirect-button">
          <b>Join an existing room</b>
        </button>
      </div>
      <DisplayTable
        rawData={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]}
        hasPagination={false}
      />
      <Modal isHidden={isHidden} setHidden={setIsHidden}>
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
    </>
  );
}
