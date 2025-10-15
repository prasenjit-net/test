import React from "react";
import "./PlayerSelect.css";

type PlayerType = "human" | "computer-easy" | "computer-hard";

interface PlayerSelectProps {
  player: "X" | "O";
  currentType: PlayerType;
  onTypeChange: (type: PlayerType) => void;
}

const PlayerSelect: React.FC<PlayerSelectProps> = ({
  player,
  currentType,
  onTypeChange,
}) => {
  return (
    <div className="player-select">
      <span className="player-label">Player {player}:</span>
      <select
        value={currentType}
        onChange={(e) => onTypeChange(e.target.value as PlayerType)}
      >
        <option value="human">Human</option>
        <option value="computer-easy">Computer (Easy)</option>
        <option value="computer-hard">Computer (Hard)</option>
      </select>
    </div>
  );
};

export default PlayerSelect;
