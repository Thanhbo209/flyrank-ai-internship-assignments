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
      params.push(`%{search.toLowerCase()}%`);
    }

    const row = db.prepare(query).all(...params);

    return row.map((task) => ({
      ...task,
      done: Boolean(task.done),
    }));
  };

  findById(id) {
    let query = "SELECT * FROM tasks WHERE id=?";
    const taskById = db.prepare(query).get(id);

    return taskById;
  }
}
