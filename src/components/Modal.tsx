import React from "react";
import "./Modal.css";
import PlayerSelect from "./PlayerSelect";

type PlayerType = "human" | "computer-easy" | "computer-hard";

interface ModalProps {
  onStart: () => void;
  onPlayerSelectChange: (player: "X" | "O", value: PlayerType) => void;
  player1Type: PlayerType;
  player2Type: PlayerType;
}

const Modal: React.FC<ModalProps> = ({
  onStart,
  onPlayerSelectChange,
  player1Type,
  player2Type,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Select Players</h2>
        </div>
        <PlayerSelect
          player="X"
          currentType={player1Type}
          onTypeChange={(type) => onPlayerSelectChange("X", type)}
        />
        <PlayerSelect
          player="O"
          currentType={player2Type}
          onTypeChange={(type) => onPlayerSelectChange("O", type)}
        />
        <button className="start-button" onClick={onStart}>
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Modal;
