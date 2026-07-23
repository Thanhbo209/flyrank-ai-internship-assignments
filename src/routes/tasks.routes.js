import express from "express";

const router = express.Router();

const TASKS = [
  {
    id: 1,
    title: "Learn TypeScript",
    done: true,
  },
  {
    id: 2,
    title: "Learn Python",
    done: false,
  },
  {
    id: 3,
    title: "Learn Java",
    done: false,
  },
];

router.get("/tasks", (req, res) => {
  const { done, search } = req.query;
  let filteredTasks = TASKS;

  if (done !== undefined) {
    const isDone = done === "true";
    filteredTasks = TASKS.filter((t) => t.done === isDone);
  }

  if (search) {
    const searchTerm = search.toLowerCase();

    filteredTasks = TASKS.filter((t) =>
      t.title.toLowerCase().includes(searchTerm),
    );
  }

  res.json(filteredTasks);
});

router.get("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  const task = TASKS.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).json({
      error: `Task ${taskId} not found`,
    });
  }

  res.status(200).json(task);
});

router.get("/stats", (req, res) => {
  const isDone = TASKS.done === "true";
  let filteredTasks = TASKS.filter((t) => t.done === isDone);

  res.status(200).json({
    total: TASKS.length,
    done: TASKS.length - filteredTasks.length,
    open: filteredTasks.length,
  });
});

router.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Title is missing!",
    });
  }

  const createdTask = {
    id: TASKS.length + 1,
    title: title,
    done: false,
  };

  TASKS.push(createdTask);

  res.status(201).json(createdTask);
});

router.put("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const { title, done } = req.body;

  const task = TASKS.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({
      error: `Task ${taskId} not found`,
    });
  }

  if (title === undefined && done === undefined) {
    return res.status(400).json({
      error: "Please provide a title or done status to update.",
    });
  }

  if (title !== undefined) task.title = title;
  if (done !== undefined) task.done = done;

  res.json(task);
});

router.delete("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  const index = TASKS.findIndex((task) => task.id === taskId);

  if (index === -1) {
    return res.status(404).json({
      error: `Task ${taskId} not found`,
    });
  }

  TASKS.splice(index, 1);

  res.status(204).end();
});

export default router;
