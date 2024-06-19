import { useContext, useEffect, useState } from "react";
import FormGrid from "../components/FormGrid";
import FormGridItem from "../components/FormGridItem";
import InputField from "../components/InputField";
import { FormInputEvent, SubmitFormEvent } from "../types";
import PasswordField from "../components/PasswordField";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse, AxiosError, HttpStatusCode } from "axios";
import useAuth from "../hooks/useAuth";
import { UserContext } from "../context/UserContext";

type SignupResp = {
  signupSuccess: boolean;
  username: string;
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [isMissingUsername, setIsMissingUsername] = useState<boolean>(false);
  const [isMissingPassword, setIsMissingPassword] = useState<boolean>(false);
  const [isMissingConfirm, setIsMissingConfirm] = useState<boolean>(false);
  const [isInvalidConfirm, setIsInvalidConfirm] = useState<boolean>(false);
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false);

  const handleUsernameChange = (event: FormInputEvent) => {
    event.preventDefault();
    setUsername(event.target.value);
    setIsMissingUsername(!event.target.value);
  };
  const handlePasswordChange = (event: FormInputEvent) => {
    const value: string = event.target.value;
    event.preventDefault();
    setPassword(event.target.value);
    setIsMissingPassword(!event.target.value);
    setIsInvalidConfirm(value != confirmPassword);
  };
  const handleConfirmChange = (event: FormInputEvent) => {
    const value: string = event.target.value;
    event.preventDefault();
    setConfirmPassword(value);
    setIsMissingConfirm(!value);
    setIsInvalidConfirm(value != password);
  };
  const handleSubmit = (event: SubmitFormEvent) => {
    event.preventDefault();
    setIsMissingUsername(!username);
    setIsMissingPassword(!password);
    setIsMissingConfirm(!confirmPassword);
    if (password != confirmPassword) {
      console.log("passwords do not match");
      setIsInvalidConfirm(true);
      return;
    }
    if (!username || !password) {
      return;
    }
    axios
      .post(
        `${import.meta.env.VITE_AUTH_URL}/signup`,
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res: AxiosResponse) => {
        const body: SignupResp = res.data;
        if (body.signupSuccess) {
          setAuth(username);
          setSignupSuccess(body.signupSuccess);
          setUser({ username: username });
        }
      })
      .catch((error: AxiosError) => {
        const statusCode = error.response?.status;
        switch (statusCode) {
          case HttpStatusCode.BadRequest:
            console.log("signup: bad request");
            break;
          case HttpStatusCode.InternalServerError:
            console.log("signup: error with server");
            break;
          default:
            console.log("signup: error submitting signup request");
        }
      });
  };

  useEffect(() => {
    if (signupSuccess) {
      navigate("/home");
    }
  }, [signupSuccess, navigate]);
  return (
    <>
      <div className="spacer" />
      <FormGrid>
        <form onSubmit={handleSubmit}>
          <FormGridItem>
            <h2>Sign up for PeerPrep!</h2>
          </FormGridItem>
          <FormGridItem>
            <InputField
              placeholder="Username"
              value={username}
              onChangeFn={handleUsernameChange}
              name="username"
              hasError={isMissingUsername}
              errorText="username cannot be empty"
            />
          </FormGridItem>
          <FormGridItem>
            <PasswordField
              placeholder="Password"
              value={password}
              name="password"
              onChangeFn={handlePasswordChange}
              hasError={isMissingPassword}
              errorText="password cannot be empty"
            />
          </FormGridItem>
          <FormGridItem>
            <PasswordField
              placeholder="Re-enter password"
              value={confirmPassword}
              name="confirm-password"
              onChangeFn={handleConfirmChange}
              hasError={isMissingConfirm || isInvalidConfirm}
              errorText={
                isMissingConfirm
                  ? "confirmation password cannot be empty"
                  : isInvalidConfirm
                  ? "passwords do not match"
                  : ""
              }
            />
          </FormGridItem>
          <FormGridItem>
            <button className="form-button" type="submit">
              <b>Sign up</b>
            </button>
          </FormGridItem>
        </form>
      </FormGrid>
    </>
  );
}
