import { useState } from "react";
import SubmitButton from "../../components/SubmitButton";

type InputEvent = React.ChangeEvent<HTMLInputElement>;
type FormEvent = React.FormEvent<HTMLFormElement>;

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isInvalidUsername, setIsInvalidUsername] = useState<boolean>(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState<boolean>(false);

  const handleUsernameChange = (event: InputEvent) => {
    event.preventDefault();
    setUsername(event.target.value);
    setIsInvalidUsername(!event.target.value);
  };
  const handlePasswordChange = (event: InputEvent) => {
    event.preventDefault();
    setPassword(event.target.value);
    setIsInvalidPassword(!event.target.value);
  };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsInvalidUsername(!username);
    setIsInvalidPassword(!password);
    if (!username || !password) {
      console.log("failed login");
      return;
    }
    console.log("login"); // TODO: handle login and redirect
  };
  return (
    <>
      <div className="page-title">
        <h1>PeerPrep</h1>
        <p>
          <b>Collaborative coding interview preparation made easy</b>
        </p>
      </div>
      <div className="login-grid">
        <form onSubmit={handleSubmit}>
          <div className="login-grid-container">
            <h2>Sign in</h2>
          </div>
          <div className="login-grid-container">
            <input
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              className="input-box"
              name="username"
            />
            {isInvalidUsername && (
              <span className="error-text">username cannot be empty</span>
            )}
          </div>
          <div className="login-grid-container">
            <input
              placeholder="Password"
              value={password}
              className="input-box"
              type="password"
              name="password"
              onChange={handlePasswordChange}
            />
            {isInvalidPassword && (
              <span className="error-text">password cannot be empty</span>
            )}
          </div>
          <div className="login-grid-container">
            <SubmitButton text={"Sign in"} />
          </div>
        </form>
      </div>
    </>
  );
}
