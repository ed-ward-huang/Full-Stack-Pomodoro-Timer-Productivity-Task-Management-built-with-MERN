import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Timer from "./Timer";
import ToDoList from "./ToDoList";
import Settings from "./Settings";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import "../App.css";
import "./Home.css";


const Home = () => {
    const location = useLocation();
    const email = location.state?.id;
    const [timerSettings, setTimerSettings] = useState({
      duration: 25 * 60, 
      label: "Work",
    });
    const [workSeconds, setWorkSeconds] = useState(0); 
    const [breakSeconds, setBreakSeconds] = useState(0);
    const [totalWorked, setTotalWorked] = useState(0);
    const [totalBreak, setTotalBreak] = useState(0); 

    useEffect(() => {
        if (email) {
            fetchSessionData(email);
        }
    }, [email]);

    const fetchSessionData = async (email) => {
        try {
            const response = await axios.post("http://localhost:8000/getSessionData", {
                email,
            });

            const { totalSecondsWorked, totalSecondsBreak } = response.data;
            
            setTotalWorked(totalSecondsWorked);
            setTotalBreak(totalSecondsBreak);

        } catch (error) {
            console.error("Failed to fetch session data:", error);
        }
    };
    
      const changeTimer = (label, duration) => {
        setTimerSettings({ label, duration });
      };


    const handleTimerComplete = () => {
      const audio = new Audio("/ringtone.mp3");
      audio.play();
      alert(`${timerSettings.label} session completed!`);
    };
  
    const updateSessionData = (newWorkSeconds, newBreakSeconds) => {
      setWorkSeconds(newWorkSeconds);
      setBreakSeconds(newBreakSeconds);
    };
  
    const COLORS = ["#00C49F", "#FFBB28"];
    const totalSessionTime = workSeconds + breakSeconds;
    const workPercentage = totalSessionTime ? (workSeconds / totalSessionTime) * 100 : 0;
    const breakPercentage = totalSessionTime ? (breakSeconds / totalSessionTime) * 100 : 0;
    const isSessionStarted = workSeconds > 0 || breakSeconds > 0;
  

    const totalCOLORS = ["#FF5733", "#3398FF"];
    const totalTotalTime = totalWorked + totalBreak;
    const totalworkPercentage = totalTotalTime ? (totalWorked / totalTotalTime) * 100 : 0;
    const totalbreakPercentage = totalTotalTime ? (totalBreak / totalTotalTime) * 100 : 0;
    const totalStarted = workSeconds > 0 || breakSeconds > 0;

    return (
      <div className="homepage">
        <header>
          <h1>{email || "User"}'s Pomodoro App</h1>
        </header>
        <div className="app">
          <Settings onChangeTimer={changeTimer} />
          <Timer
            timerDuration={timerSettings.duration}
            label={timerSettings.label}
            onTimerComplete={handleTimerComplete}
            onUpdateSession={updateSessionData}
            email={location.state?.id} 
          />
          <ToDoList email = {email}/>
            <div className="ring-graph1">
              <h3>Session Productivity</h3>
              {isSessionStarted ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Work", value: workSeconds },
                        { name: "Break", value: breakSeconds || 0.1 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={90}
                      outerRadius={97}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: "Work", value: workSeconds },
                        { name: "Break", value: breakSeconds || 0.1 },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                      <Label
                        value={`${Math.round(workPercentage)}% Work`}
                        position="center"
                        fontSize={16}
                        fontWeight="bold"
                        fill="#00C49F"
                        dy={-10}
                      />
                      <Label
                        value={`${Math.round(breakPercentage)}% Break`}
                        position="center"
                        fontSize={16}
                        fontWeight="bold"
                        fill="#FFBB28"
                        dy={10}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p>Session hasn't started</p>
              )}
          </div>

          <div className="ring-graph2">
              <h3>All Time Productivity</h3>
              {totalStarted ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Work", value: totalWorked },
                        { name: "Break", value: totalBreak || 0.1 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={90}
                      outerRadius={97}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: "Work", value: totalWorked },
                        { name: "Break", value: totalBreak || 0.1 },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={totalCOLORS[index % totalCOLORS.length]} />
                      ))}
                      <Label
                        value={`${Math.round(totalworkPercentage)}% Work`}
                        position="center"
                        fontSize={16}
                        fontWeight="bold"
                        fill="#FF5733"
                        dy={-10}
                      />
                      <Label
                        value={`${Math.round(totalbreakPercentage)}% Break`}
                        position="center"
                        fontSize={16}
                        fontWeight="bold"
                        fill="#3398FF"
                        dy={10}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p>Loading...</p>
              )}
          </div>

        </div>
      </div>
    );
  };
  
  export default Home;
  