const tasks = []; // Almacenar tareas que se pueden ir ejecutando
let time = 0; // Esta variable llevará la cuenta regresiva
let timer = null; // Tendrá una función setInterval, nos permitirá ejecutar un pedzado de codigo cada determinado tiempo
let timerBreak = null; // Los 5 min de descanso
let current = null; // Nos va a decir cual es la tarea que se está ejecutando

// Referencia a nuestros elementos del DOM mediante variables.

const bAdd = document.querySelector("#bAdd");
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");
const taskName = document.querySelector("#time #taskName");

renderTime();
renderTasks();

// Generación de eventos para agregar las tasks.

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (itTask.value != "") {
    createTask(itTask.value);
    itTask.value = "";
    renderTasks();
  }
});

// Creamos la función para la creación de Tasks mediante objetos. Los arreglos de Tasks serán objetos.

function createTask(value) {
  const newTask = {
    id: (Math.random() * 100).toString(36).slice(3), // nos genera un ID dinámico para la creación del Task.
    title: value,
    completed: false,
  };

  tasks.unshift(newTask); // Utilizamos unshift para agregar el elemento a nuestro array
}

// Creamos una función que tomemos cada una de las tareas y generar un HTML que inyectaremos en un contenedor.

function renderTasks() {
  const html = tasks.map((task) => {
    return `
        <div class="task">
            <div class="completed">${
              task.completed
                ? `<span class="done">Done</span>`
                : `<button class="start-button" data-id="${task.id}">START</button>`
            }</div>
            <div class="title">${task.title}</div>
        </div>
    `;
  });

  const tasksContainer = document.querySelector("#tasks");
  tasksContainer.innerHTML = html.join("");

  // Botones para iniciación de función pomodoro.

  const startButtons = document.querySelectorAll(".task .start-button");

  startButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (!timer) {
        const id = button.getAttribute("data-id");
        startButtonHandler(id);
        button.textContent = "In progress ... ";
      }
    });
  });
}

//Generamos la función para generar el tiempos del pomodoro.

function startButtonHandler(id) {
  time = 25 * 60;
  current = id;
  const taskIndex = tasks.findIndex((task) => task.id === id);
  taskName.textContent = tasks[taskIndex].title;
  renderTime();
  timer = setInterval(() => {
    timerHandler(id);
  }, 1000);
}

function timerHandler(id) {
  time--;
  renderTime();

  if (time === 0) {
    clearInterval(timer);
    markCompleted(id);
    timer = null;
    renderTasks();
    startBreak();
  }
}

// Función para la creación de tiempo de break

function startBreak() {
  time = 5 * 60;
  taskName.textContent = "Break";
  renderTime();
  timerBreak = setInterval(() => {
    timerBreakHandler();
  }, 1000);
}

function timerBreakHandler() {
  time--;
  renderTime();

  if (time === 0) {
    clearInterval(timerBreak);
    current = null;
    timerBreak = null;
    taskName.textContent = "";
    renderTasks();
  }
}

// Función para renderizar el tiempo en segundos

function renderTime() {
  const timeDiv = document.querySelector("#time #value");
  const minutes = parseInt(time / 60);
  const seconds = parseInt(time % 60);

  timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

// Función para marcar las tareas realizadas

function markCompleted(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  tasks[taskIndex].completed = true;
}
