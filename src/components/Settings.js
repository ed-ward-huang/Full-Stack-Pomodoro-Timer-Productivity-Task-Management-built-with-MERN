import React from "react";
import "./Settings.css";

const Settings = ({ onChangeTimer }) => {
  return (
    <div className="settings-container">
      <button onClick={() => onChangeTimer("Work", 25 * 60)}>Work (25 min)</button>
      <button onClick={() => onChangeTimer("Short Break", 5 * 60)}>
        Short Break (5 min)
      </button>
      <button onClick={() => onChangeTimer("Long Break", 15 * 60)}>
        Long Break (15 min)
      </button>
    </div>
  );
};

export default Settings;