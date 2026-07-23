import TaskRepository from "../repositories/tasks.repository.js";
const taskRepository = new TaskRepository();

class TaskService {
  listTasks = ({ done, search } = {}) => {
    return taskRepository.findAll({ done, search });
  };

  getTask = (id) => {
    return taskRepository.findById(id);
  };
}

export default TaskService;
