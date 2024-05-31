import { useState } from "react";
import { FormInputEvent } from "../types";
import { IconEye, IconEyeInvisible } from "./svg";

interface PasswordFieldProps {
  placeholder: string;
  value: string;
  onChangeFn: (e: FormInputEvent) => void;
  hasError: boolean;
  errorText: string;
  name: string;
}

export default function PasswordField(props: PasswordFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  return (
    <>
      <div className="password-group">
        <input
          placeholder={props.placeholder}
          value={props.value}
          className="password-box"
          type={isPasswordVisible ? "text" : "password"}
          name={props.name}
          onChange={props.onChangeFn}
        />
        <button
          className="visible-button"
          type="button"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? <IconEye /> : <IconEyeInvisible />}
        </button>
      </div>
      {props.hasError && <span className="error-text">{props.errorText}</span>}
    </>
  );
}
