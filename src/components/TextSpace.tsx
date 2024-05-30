interface TextSpaceProps {
  repetitions: number;
}
export default function TextSpace(props: TextSpaceProps) {
  return (
    <>
      {Array(props.repetitions)
        .fill(null)
        .map((_, index) => (
          <p key={index}>&nbsp;</p>
        ))}
    </>
  );
}
