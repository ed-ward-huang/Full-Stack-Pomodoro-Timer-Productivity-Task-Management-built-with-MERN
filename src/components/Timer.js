import React, { useState, useEffect } from "react";
import "./Timer.css";

const Timer = ({ timerDuration, label, onTimerComplete }) => {
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(timerDuration);
    setIsRunning(false);
  }, [timerDuration]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            onTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, onTimerComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timerDuration);
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = (timeLeft / timerDuration) * 100;

  return (
    <div className="timer-container">
      <p className="timer-label">{label} Time</p>
      <div className="timer-layout">
        <div className="progress-circle">
          <svg viewBox="0 0 36 36" className="progress-ring">
            <path
              className="progress-ring__background"
              d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
            />
            <path
              className="progress-ring__progress"
              strokeDasharray={`${progress}, 100`}
              d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
            />
          </svg>
          <div className="timer-time">{formatTime()}</div>
        </div>
        <div className="timer-buttons">
          <button onClick={toggleTimer}>
            {isRunning ? "Pause" : "Start"}
          </button>
          <button onClick={resetTimer}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
