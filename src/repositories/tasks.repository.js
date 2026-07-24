import db from "../db/db.js";

export default class TaskRepository {
  findAll = ({ done, search } = {}) => {
    let query = "SELECT * FROM tasks WHERE 1=1";
    const params = [];

    if (done !== undefined) {
      query += " AND done = ?";
      params.push(done === "true" ? 1 : 0);
    }

    if (search) {
      query += " AND LOWER(title) LIKE ?";
      params.push(`%${search.toLowerCase()}%`);
    }

    const row = db.prepare(query).all(...params);

    return row.map((task) => ({
      ...task,
      done: Boolean(task.done),
    }));
  };

  findById = (id) => {
    return db.prepare("SELECT * FROM tasks WHERE id=?").get(id);
  };

  createTask = ({ title } = {}) => {
    const insert = db.prepare("INSERT INTO tasks (title, done) VALUES (?, 0)");
    return insert.run(title);
  };

  updateTask = (id, title, done) => {
    const update = db.prepare(
      "UPDATE tasks SET title = ?, done = ? WHERE id = ?",
    );
    const result = update.run(title, done ? 1 : 0, id);
    if (result.changes === 0) return null;
    return { id, title, done: Boolean(done) };
  };

  deleteTask = (id) => {
    const deleted = db.prepare("DELETE from tasks WHERE id = ?");
    return deleted.run(id);
  };
}
