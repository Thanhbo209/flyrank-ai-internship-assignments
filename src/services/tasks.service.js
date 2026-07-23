import TaskRepository from "../repositories/tasks.repository.js";

const taskRepository = new TaskRepository();

class TaskService {
  listTasks = ({ done, search } = {}) => {
    return taskRepository.findAll({ done, search });
  };

  getTask = (id) => {
    return taskRepository.findById(id);
  };

  addTask = (body) => {
    const { title } = body || {};
    if (!title || typeof title !== "string" || !title.trim()) {
      throw new Error("Task title is required");
    }
    return taskRepository.createTask({ title });
  };
}

export default TaskService;
