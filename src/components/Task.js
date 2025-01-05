import React from "react";
import "./Task.css";

const Task = ({ task, toggleCompletion, deleteTask }) => {
  return (
    <li className={`task ${task.completed ? "completed" : ""}`}>
      <span onClick={() => toggleCompletion(task.id)}>{task.text}</span>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </li>
  );
};

export default Task;
