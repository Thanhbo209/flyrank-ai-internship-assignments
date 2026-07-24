import TaskRepository from "../repositories/tasks.repository.js";

const taskRepository = new TaskRepository();

class TaskService {
  listTasks = ({ done, search } = {}) => {
    return taskRepository.findAll({ done, search });
  };

  getTaskById = (id) => {
    return taskRepository.findById(id);
  };

  addTask = (title) => {
    return taskRepository.createTask({ title });
  };

  editTask = (id, body) => {
    const { title, done } = body || {};
    return taskRepository.updateTask(id, title, done);
  };

  removeTask = (id) => {
    return taskRepository.deleteTask(id);
  };
}

export default TaskService;
