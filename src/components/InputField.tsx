import { FormInputEvent } from "../types";

interface InputFieldProps {
  placeholder: string;
  value: string;
  hasError: boolean;
  onChangeFn: (e: FormInputEvent) => void;
  errorText: string;
  name: string;
}

export default function InputField(props: InputFieldProps) {
  return (
    <>
      <input
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChangeFn}
        className="input-box"
        name={props.name}
      />
      {props.hasError && <span className="error-text">{props.errorText}</span>}
    </>
  );
}
