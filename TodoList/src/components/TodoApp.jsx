import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "./TodoApp.css";
import "react-calendar/dist/Calendar.css";

// Function to play sound
const playSound = (sound) => {
  const audio = new Audio(`/sounds/${sound}.mp3`);
  audio.volume = 0.3;
  audio.play();
};

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTask, setEditedTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      const currentDateTime = new Date().toLocaleString();
      setTasks([
        ...tasks,
        { text: newTask, completed: false, importance: "low", dateTime: currentDateTime }
      ]);
      setNewTask("");
      playSound("add");
    }
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
    playSound("complete");
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    playSound("delete");
  };

  const setImportance = (index, importance) => {
    const newTasks = [...tasks];
    newTasks[index].importance = importance;
    setTasks(newTasks);
    playSound("priority");
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedTask(tasks[index].text);
  };

  const saveEdit = (index) => {
    const newTasks = [...tasks];
    newTasks[index].text = editedTask;
    setTasks(newTasks);
    setEditingIndex(null);
    setEditedTask("");
    playSound("edit");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "inprogress") return !task.completed;
    return true;
  });

  return (
    <div className="todo-app">
      <Card className="todo-card">
        <CardContent>
          <h1 className="todo-title">To Do List</h1>
          <div className="todo-input">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task"
            />
            <Button onClick={addTask}>Add</Button>
          </div>
          <div className="todo-filters">
            <Button onClick={() => { setFilter("all"); playSound("click"); }}>All</Button>
            <Button onClick={() => { setFilter("completed"); playSound("click"); }}>Completed</Button>
            <Button onClick={() => { setFilter("inprogress"); playSound("click"); }}>In Progress</Button>
            <Button onClick={() => setModalIsOpen(true)}>Calendar</Button>
          </div>
          <ul className="todo-list">
            {filteredTasks.map((task, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`todo-item ${task.importance}`}
              >
                <div className="todo-task">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(index)}
                  />
                  {editingIndex === index ? (
                    <Input
                      value={editedTask}
                      onChange={(e) => setEditedTask(e.target.value)}
                    />
                  ) : (
                    <span className={task.completed ? "completed" : ""}>{task.text}</span>
                  )}
                  <div className="todo-time">📅 {task.dateTime}</div>
                </div>
                <div className="todo-actions">
                  <select
                    onChange={(e) => setImportance(index, e.target.value)}
                    value={task.importance}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <Button onClick={() => deleteTask(index)}>Delete</Button>
                  {editingIndex === index ? (
                    <Button onClick={() => saveEdit(index)}>Save</Button>
                  ) : (
                    <Button onClick={() => startEditing(index)}>Edit</Button>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="calendar-modal">
        <h2>Select Date</h2>
        <Calendar
          tileClassName={({ date }) => {
            const taskDates = tasks.map((task) => new Date(task.dateTime).toDateString());
            return taskDates.includes(date.toDateString()) ? "task-dot" : null;
          }}
        />
        <Button onClick={() => setModalIsOpen(false)}>Close</Button>
      </Modal>
    </div>
  );
}
