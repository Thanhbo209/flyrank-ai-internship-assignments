import Database from "better-sqlite3";
import { join } from "node:path";

const db = new Database(join(import.meta.dirname, "tasks.db"));

db.exec(`
   CREATE TABLE IF NOT EXISTS tasks (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   title TEXT NOT NULL,
   done INTEGER default 0
   )`);

console.log("Table created successfully");

const rowCount = db.prepare("SELECT COUNT(*) AS count FROM tasks").get().count;

if (rowCount === 0) {
  const seedTasks = [
    { title: "Buy groceries", done: 0 },
    { title: "Read a book", done: 0 },
    { title: "Build SQLite setup", done: 1 },
  ];

  const insertTask = db.prepare("INSERT INTO tasks(title, done) VALUES (?, ?)");

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

export default db;
