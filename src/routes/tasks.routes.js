import express from "express";
import TaskService from "../services/tasks.service.js";
const router = express.Router();
const taskService = new TaskService();

router.get("/tasks", (req, res, next) => {
  try {
    const tasks = taskService.listTasks(req.query);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get("/tasks/:id", (req, res, next) => {
  try {
    const taskById = taskService.getTask(req.params.id);
    res.json(taskById);
  } catch (error) {
    next(error);
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
  try {
    const createdTask = taskService.addTask(req.body);
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// router.put("/tasks/:id", (req, res) => {
//   const taskId = Number(req.params.id);
//   const { title, done } = req.body;

//   const task = TASKS.find((t) => t.id === taskId);

//   if (!task) {
//     return res.status(404).json({
//       error: `Task ${taskId} not found`,
//     });
//   }

//   if (title === undefined && done === undefined) {
//     return res.status(400).json({
//       error: "Please provide a title or done status to update.",
//     });
//   }

//   if (title !== undefined) task.title = title;
//   if (done !== undefined) task.done = done;

//   res.json(task);
// });

// router.delete("/tasks/:id", (req, res) => {
//   const taskId = Number(req.params.id);

//   const index = TASKS.findIndex((task) => task.id === taskId);

//   if (index === -1) {
//     return res.status(404).json({
//       error: `Task ${taskId} not found`,
//     });
//   }

//   TASKS.splice(index, 1);

//   res.status(204).end();
// });

export default router;
