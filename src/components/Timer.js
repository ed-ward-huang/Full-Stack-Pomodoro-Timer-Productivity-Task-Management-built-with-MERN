import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Timer.css";
const Timer = ({ timerDuration, label, onTimerComplete, onUpdateSession, email }) => {
  const [timeLeft, setTimeLeft] = useState(timerDuration); 
  const [isRunning, setIsRunning] = useState(false);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);

  useEffect(() => {
    setTimeLeft(timerDuration);
    setIsRunning(false);
  }, [timerDuration]);


  useEffect(() => {
    let timer;
    let workAccumulated = 0;
    let breakAccumulated = 0;
    if (isRunning) {
      timer = setInterval(async () => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            onTimerComplete();
            return 0;
          }

          if (label === "Work") {
            setWorkSeconds((prev) => {
              const newWorkSeconds = prev + 0.5;
              const workAccumulated = 0.25
              onUpdateSession(newWorkSeconds, breakSeconds); 
              updateSession(workAccumulated, breakAccumulated);
              return newWorkSeconds;
            });
          } else {
            setBreakSeconds((prev) => {
              const newBreakSeconds = prev + 0.5;
              const breakAccumulated = 0.25
              onUpdateSession(workSeconds, newBreakSeconds);
              updateSession(workAccumulated, breakAccumulated); 
              return newBreakSeconds;
            });
          }

          return prevTime - 1; 
        });
      }, 1000); 
    }

    const updateSession = async (workSeconds, breakSeconds) => {
        try {
            const response = await axios.post("http://localhost:8000/updateSession", {
                email,
                workSeconds,
                breakSeconds,
            });
            console.log("Update Response:", response.data); 
        } catch (error) {
            console.error("Failed to update session:", error);
        }
    };

    return () => clearInterval(timer);
  }, [isRunning, label, workSeconds, breakSeconds, onTimerComplete, onUpdateSession]);

  const toggleTimer = () => setIsRunning(!isRunning); 
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timerDuration);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

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
              strokeDasharray={`${(timeLeft / timerDuration) * 100}, 100`}
              d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
            />
          </svg>
          <div className="timer-time">{formatTime(timeLeft)}</div>
        </div>
        <div className="timer-buttons">
          <button onClick={toggleTimer}>
            {isRunning ? "Pause" : "Start"}
          </button>
          <button onClick={resetTimer}>Reset</button>
        </div>
      </div>
      <div className="productivity-summary">
        <h3>Session Productivity</h3>
        <p>Work: {formatTime(workSeconds)}</p>
        <p>Break: {formatTime(breakSeconds)}</p>
      </div>
    </div>
  );
};

export default Timer;
