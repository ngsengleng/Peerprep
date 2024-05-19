import { Dispatch, ReactNode, SetStateAction } from "react";

interface ModalProps {
  isHidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}
export default function Modal(props: ModalProps) {
  return (
    <>
      {!props.isHidden && (
        <>
          <div
            className="modal-backdrop"
            onClick={() => props.setHidden(true)}
          />
          <div className="modal">{props.children}</div>
        </>

        // </div>
      )}
    </>
  );
}
