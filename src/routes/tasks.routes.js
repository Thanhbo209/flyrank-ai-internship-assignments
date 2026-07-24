import express from "express";
import TaskService from "../services/tasks.service.js";
const router = express.Router();
const taskService = new TaskService();

router.get("/tasks", (req, res, next) => {
  try {
    const tasks = taskService.listTasks(req.query);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/tasks/:id", (req, res, next) => {
  const taskId = req.params.id;
  if (!taskId) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }
  try {
    const taskById = taskService.getTaskById(taskId);
    res.status(200).json(taskById);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// router.get("/stats", (req, res) => {
//   const isDone = TASKS.done === "true";
//   let filteredTasks = TASKS.filter((t) => t.done === isDone);

//   res.status(200).json({
//     total: TASKS.length,
//     done: TASKS.length - filteredTasks.length,
//     open: filteredTasks.length,
//   });
// });

router.post("/tasks", (req, res, next) => {
  const { title } = req.body;
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json("Title is required");
  }
  try {
    const createdTask = taskService.addTask(title);
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const { title, done } = req.body;

  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ error: "Invalid task id" });
  }

  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: "Nothing to update" });
  }
  try {
    const updatedTask = taskService.editTask(taskId, { title, done });
    if (!updatedTask) {
      return res.status(404).json({ error: `Task ${taskId} not found` });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  if (!taskId) {
    return res.status(404).json(`Task ${taskId} not found`);
  }

  try {
    const deleted = taskService.removeTask(taskId);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
