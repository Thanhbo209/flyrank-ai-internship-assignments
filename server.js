import express from "express";

const app = express();
const PORT = 3000;

const TASKS = [
  {
    id: 1,
    title: "Learn TypeScript",
    done: true
  },
  {
    id: 2,
    title: "Learn Python",
    done: false
  },
  {
    id: 3,
    title: "Learn Java",
    done: false
  },


]

app.get("/", (req, res) => {
  res.status(200).json({
    "name": "Task API",
    "version": "1.0",
    "endpoints": ["/tasks"]
  });
});

app.get("/health", (req, res) => {
  res.json({
    "status": "ok"
  })
})

app.get("/tasks", (req, res) => {
  res.status(200).json(TASKS);
})

app.get("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  const task = TASKS.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).json({
      error: `Task ${taskId} not found`
    })
  }

  res.status(200).json(task);
})


app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
