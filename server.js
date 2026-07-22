import express from "express";
import swaggerUi from "swagger-ui-express";
import { readFile } from "node:fs/promises";

const openapiDocument = JSON.parse(
  await readFile(new URL("./openapi.json", import.meta.url))
);

const app = express();
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

const PORT = 3000;

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

app.get("/", (req, res) => {
  res.status(200).json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.get("/tasks", (req, res) => {
  res.status(200).json(TASKS);
});

app.get("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  const task = TASKS.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).json({
      error: `Task ${taskId} not found`,
    });
  }

  res.status(200).json(task);
});

app.post("/tasks", (req, res) => {
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

app.put("/tasks/:id", (req, res) => {
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

app.delete("/tasks/:id", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
