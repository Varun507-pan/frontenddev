// tasks stored as array: { id, userId, title, description, status, createdAt, updatedAt }
export function loadTasks() {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}

export function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function createTask(task) {
  const tasks = loadTasks();
  tasks.push(task);
  saveTasks(tasks);
}

export function updateTask(updated) {
  let tasks = loadTasks();
  tasks = tasks.map((t) => (t.id === updated.id ? updated : t));
  saveTasks(tasks);
}

export function deleteTask(id) {
  let tasks = loadTasks();
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks(tasks);
}
