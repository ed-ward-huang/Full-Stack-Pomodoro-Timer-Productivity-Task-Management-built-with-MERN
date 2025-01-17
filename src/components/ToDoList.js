import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "./ToDoList.css";

const ToDoList = ({email}) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(""); 

  useEffect(() => {
    axios
      .post("http://localhost:8000/getTasks", { email })
      .then((response) => {
        setTasks(response.data.todolist);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      axios
        .post("http://localhost:8000/addTask", { email, task: newTask })
        .then(() => {
          setTasks([...tasks, newTask]);
          setNewTask("");
        })
        .catch((error) => {
          console.error("Error adding task:", error);
        });
    }
  };

  const deleteTask = (task) => {
    axios
      .post("http://localhost:8000/deleteTask", { email, task })
      .then(() => {
        setTasks(tasks.filter((t) => t !== task)); 
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  return (
    <div className="todo-list-container">
      <h2 className="todo-title">My Tasks</h2>
      <div className="task-input">
        <input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index}>
            <span>{task}</span>
            <button className="delete-btn" onClick={() => deleteTask(task)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
