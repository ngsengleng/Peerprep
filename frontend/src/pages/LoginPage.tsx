import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormGridItem from "../components/FormGridItem";
import FormGrid from "../components/FormGrid";
import { SubmitFormEvent, FormInputEvent } from "../types";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import { UserContext } from "../context/UserContext";
import axios, { AxiosError, AxiosResponse } from "axios";
import useAuth from "../hooks/useAuth";
import { ErrorCode, ErrorResp, LoginBody, LoginResp } from "../http/httpTypes";
import Modal from "../components/Modal";
import {
  Config,
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

const generatorNameConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: "_",
  length: 2,
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState<string>("");
  const [guestUser, setGuestUser] = useState<string>(
    uniqueNamesGenerator(generatorNameConfig)
  );
  const [password, setPassword] = useState<string>("");
  const [isInvalidUsername, setIsInvalidUsername] = useState<boolean>(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [modalHidden, setModalHidden] = useState<boolean>(true);

  const handleGuestChange = (event: FormInputEvent) => {
    event.preventDefault();
    setGuestUser(event.target.value);
  };
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
  const handleGuestUser = () => {
    setUser({ username: guestUser });
    setAuth(guestUser);
    setLoginSuccess(true);
  };

  const handleSubmit = (event: SubmitFormEvent) => {
    event.preventDefault();
    setIsInvalidUsername(!username);
    setIsInvalidPassword(!password);
    if (!username || !password) {
      return;
    }
    const reqLoginObj: LoginBody = {
      username: username,
      password: password,
    };
    axios
      .post(`${import.meta.env.VITE_AUTH_URL}/login`, reqLoginObj, {
        withCredentials: true,
      })
      .then((res: AxiosResponse) => {
        const body: LoginResp = res.data;
        if (body.loginSuccess) {
          setAuth(username);
          setLoginSuccess(body.loginSuccess);
          setUser({ username: username });
          return;
        }
        switch (body.errorCode) {
          case ErrorCode.USER_DOES_NOT_EXIST:
            window.alert("this user does not exist");
            break;
          case ErrorCode.INCORRECT_PASSWORD:
            window.alert("password is incorrect");
            break;
        }
      })
      .catch((error: AxiosError) => {
        const res = error.response?.data as ErrorResp;
        if (res == null) {
          console.log("unknown error");
          return;
        }
        switch (res.errorCode) {
          default:
            window.alert("some error occurred when logging in");
        }
      });
  };

  useEffect(() => {
    if (loginSuccess) {
      navigate("/home");
    }
  }, [loginSuccess, navigate]);
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
            <div>Or</div>
            <a href="#" onClick={() => setModalHidden(false)}>
              Continue as guest
            </a>
          </FormGridItem>
        </form>
      </FormGrid>
      <Modal isHidden={modalHidden} setHidden={setModalHidden}>
        <h2>Enter your guest username</h2>
        <input
          value={guestUser}
          className="login-modal-input"
          onChange={handleGuestChange}
        />
        <button className="login-modal-button" onClick={handleGuestUser}>
          <strong>Continue</strong>
        </button>
      </Modal>
    </>
  );
}
