document.addEventListener("DOMContentLoaded", () => {
  getActivePage(getPage() || "all");
});

const taskList = document.querySelector("#taskList");
const taskInput = document.querySelector("#taskInput");
const deleteAll = document.querySelector("#deleteAll");
const filters = document.querySelector("#filters");

function getActivePage(status) {
  if (getTasks().length != 0)
    document.querySelector("#" + getPage()).style.backgroundColor = "#007bff";
  setPage(status);
  document.querySelector("#" + status).style.backgroundColor = "black";
  filterTasks(status);
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const tasks = getTasks();
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
    timestamp: new Date().toLocaleString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  taskInput.value = "";
  getActivePage(getPage() || "all");
}

function toggleTaskStatus(taskId) {
  const tasks = getTasks();
  const task = tasks.find((task) => task.id === taskId);
  task.completed = !task.completed;
  saveTasks(tasks);
  getActivePage(getPage() || "all");
}

function deleteTask(taskId) {
  const tasks = getTasks().filter((task) => task.id !== taskId);
  if (tasks.length === 0) {
    document.querySelector("#" + getPage()).style.backgroundColor = "#007bff";
    setPage("all");
  }
  saveTasks(tasks);
  getActivePage(getPage() || "all");
}

function deleteAllTasks() {
  saveTasks(
    getTasks().filter((task) => {
      if (getPage() === "all") return false;
      if (getPage() === "pending") return task.completed;
      if (getPage() === "completed") return !task.completed;
    })
  );
  if (getTasks().length === 0) {
    document.querySelector("#" + getPage()).style.backgroundColor = "#007bff";
    setPage("all");
  }
  getActivePage(getPage() || "all");
}

function filterTasks(status) {
  const tasks = getTasks();
  displayTasks(
    tasks.filter((task) => {
      if (status === "all") return true;
      if (status === "pending") return !task.completed;
      if (status === "completed") return task.completed;
    })
  );
}

function displayTasks(tasks = getTasks()) {
  taskList.innerHTML = "";
  if (tasks.length === 0) {
    deleteAll.style.display = "none";
    if (getTasks().length === 0) filters.style.display = "none";
  } else {
    if (getTasks().length === 0) {
      deleteAll.style.display = "none";
      filters.style.display = "none";
      return;
    } else {
      deleteAll.style.display = "block";
      filters.style.display = "flex";
    }
    tasks.forEach((task) => {
      const taskElement = document.createElement("li");
      taskElement.className = task.completed ? "completed" : "";
      taskElement.innerHTML = `
              <span>${task.text} <small>(${task.timestamp})</small></span>
              <div><button onclick="toggleTaskStatus(${task.id})">${
        task.completed ? "Undo" : "Complete"
      }</button>
              <button onclick="deleteTask(${task.id})">Delete</button></div>
          `;
      taskList.appendChild(taskElement);
    });
  }
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getPage() {
  return JSON.parse(localStorage.getItem("activePage"));
}

function setPage(page) {
  return localStorage.setItem("activePage", JSON.stringify(page));
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}
