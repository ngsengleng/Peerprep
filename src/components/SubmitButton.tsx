interface SubmitButtonProps {
  text: string;
}

export default function SubmitButton(props: SubmitButtonProps) {
  return (
    <button className="submit-button" type="submit">
      <b>{props.text}</b>
    </button>
  );
}
