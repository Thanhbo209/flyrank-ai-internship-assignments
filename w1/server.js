import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Hello, World!",
  });
});

app.get("/about", (req, res) => {
  res.json({
    name: "Pham Thanh",
    course: "Backend AI Engineering",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
