import React, { useState } from "react";
import Timer from "./components/Timer";
import ToDoList from "./components/ToDoList";
import Settings from "./components/Settings";
import "./App.css";

const App = () => {
  const [timerSettings, setTimerSettings] = useState({
    duration: 25 * 60,
    label: "Work",
  });

  const changeTimer = (label, duration) => {
    setTimerSettings({ label, duration });
  };

  const handleTimerComplete = () => {
    const audio = new Audio("/ringtone.mp3");
    audio.play();
    alert(`${timerSettings.label} session completed!`);
  };

  return (
    <div className="app">
      <header>
        <h1>Pomodoro App</h1>
      </header>
      <Settings onChangeTimer={changeTimer} />
      <Timer
        timerDuration={timerSettings.duration}
        label={timerSettings.label}
        onTimerComplete={handleTimerComplete}
      />
      <ToDoList />
    </div>
  );
};

export default App;
