import express from "express";
import swaggerUi from "swagger-ui-express";
import { readFile } from "node:fs/promises";
import Database from "better-sqlite3";

const db = new Database("tasks.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0

  )
  `);

const rowCount = db.prepare("SELECT COUNT(*) AS count FROM tasks").get().count;

if (rowCount === 0) {
  // Define seed data
  const seedTasks = [
    { title: "Buy groceries", done: 0 },
    { title: "Read a book", done: 0 },
    { title: "Build SQLite setup", done: 1 },
  ];

  const insertTask = db.prepare(
    "INSERT INTO tasks (title, done) VALUES (?, ?)",
  );

  const seedDatabase = db.transaction((tasks) => {
    for (const task of tasks) {
      insertTask.run(task.title, task.done);
    }
  });

  seedDatabase(seedTasks);
  console.log("Table was empty. Seeded 3 example tasks!");
} else {
  console.log(`Table already has ${rowCount} tasks. Skipping seed.`);
}

db.close();

const openapiDocument = JSON.parse(
  await readFile(new URL("./openapi.json", import.meta.url)),
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

app.get("/stats", (req, res) => {
  const isDone = TASKS.done === "true";
  let filteredTasks = TASKS.filter((t) => t.done === isDone);

  res.status(200).json({
    total: TASKS.length,
    done: TASKS.length - filteredTasks.length,
    open: filteredTasks.length,
  });
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
