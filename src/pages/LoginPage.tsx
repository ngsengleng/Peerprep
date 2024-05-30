import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormGridItem from "../components/FormGridItem";
import FormGrid from "../components/FormGrid";
import { SubmitFormEvent, FormInputEvent } from "../types";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isInvalidUsername, setIsInvalidUsername] = useState<boolean>(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState<boolean>(false);

  const handleUsernameChange = (event: FormInputEvent) => {
    event.preventDefault();
    setUsername(event.target.value);
    setIsInvalidUsername(!event.target.value);
  };
  const handlePasswordChange = (event: FormInputEvent) => {
    event.preventDefault();
    setPassword(event.target.value);
    setIsInvalidPassword(!event.target.value);
  };
  const handleSubmit = (event: SubmitFormEvent) => {
    event.preventDefault();
    setIsInvalidUsername(!username);
    setIsInvalidPassword(!password);
    if (!username || !password) {
      console.log("failed login");
      return;
    }
    console.log("login"); // TODO: handle login and redirect
    navigate("/home");
  };
  return (
    <>
      <div className="login-title">
        <h1>PeerPrep</h1>
        <p>
          <b>Collaborative coding interview preparation made easy</b>
        </p>
      </div>
      <FormGrid>
        <form onSubmit={handleSubmit}>
          <FormGridItem>
            <h2>Sign in</h2>
          </FormGridItem>
          <FormGridItem>
            <InputField
              placeholder="Username"
              value={username}
              onChangeFn={handleUsernameChange}
              name="username"
              hasError={isInvalidUsername}
              errorText="username cannot be empty"
            />
          </FormGridItem>
          <FormGridItem>
            <PasswordField
              placeholder="Password"
              value={password}
              name="password"
              onChangeFn={handlePasswordChange}
              hasError={isInvalidPassword}
              errorText="password cannot be empty"
            />
          </FormGridItem>
          <FormGridItem>
            <button className="form-button" type="submit">
              <b>Sign in</b>
            </button>
          </FormGridItem>
          <FormGridItem>
            <Link to={"/signup"}>Create an account</Link>
          </FormGridItem>
        </form>
      </FormGrid>
    </>
  );
}
