import { FC } from "react";
import "./ConfirmModalComponentProps.css";

interface ConfromModalComponentProps {
  show: boolean;
  content: string;
  close: () => void;
}

const ConfirmModalComponent: FC<ConfromModalComponentProps> = ({
  show,
  content,
  close,
}) => {
  if (!show) {
    return null;
  } else {
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>You tried to resrve and ...</h2>
          <h3 className="modalText">{content}</h3>
          <button onClick={() => close()}>Ok, close</button>
        </div>
      </div>
    );
  }
};

export default ConfirmModalComponent