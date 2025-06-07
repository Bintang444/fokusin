let currentMode = "pomodoro";

const timerSettings = {
  pomodoro: 25,
  short: 5,
  long: 15,
};

let workMinutes = timerSettings[currentMode];
let seconds = 0;
let isRunning = false;
let timerInterval;

const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const modeButtons = document.querySelectorAll(".mode-selector .mode");

function updateDisplay(min, sec) {
  timeDisplay.textContent =
    String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  let totalSeconds = workMinutes * 60 + seconds;

  timerInterval = setInterval(() => {
    totalSeconds--;
    let min = Math.floor(totalSeconds / 60);
    let sec = totalSeconds % 60;

    updateDisplay(min, sec);

    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      onTimerEnd(); // ini penting!
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  updateDisplay(workMinutes, 0);
  seconds = 0;
}

// Fungsi untuk ganti mode timer
function switchMode(mode) {
  currentMode = mode;
  workMinutes = timerSettings[mode];
  seconds = 0;
  resetTimer();

  // Update style tombol aktif
  modeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    switchMode(btn.dataset.mode);
  });
});

// Tampilkan waktu awal mode default
updateDisplay(workMinutes, seconds);

const taskInput = document.getElementById("taskInput");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

function renderTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${
        task.done ? "checked" : ""
      } data-index="${index}" />
      <span style="text-decoration:${task.done ? "line-through" : "none"}">${
      task.text
    }</span>
    `;
    taskList.appendChild(li);
  });
}

addTask.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return;

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text, done: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  renderTasks();
});

taskList.addEventListener("change", (e) => {
  const index = e.target.getAttribute("data-index");
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks[index].done = e.target.checked;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
});

renderTasks();

const colorPicker = document.getElementById("colorPicker");

colorPicker.addEventListener("input", (e) => {
  document.documentElement.style.setProperty("--main-color", e.target.value);
  localStorage.setItem("themeColor", e.target.value);
});

// Apply saved themex
const savedColor = localStorage.getItem("themeColor");
if (savedColor) {
  document.documentElement.style.setProperty("--main-color", savedColor);
  colorPicker.value = savedColor;
}

const alarm = document.getElementById("alarmSound");

// Timer berakhir
function onTimerEnd() {
  alarm.play(); // Mainkan suara
  alert("Waktunya habis bro! 💆‍♂️"); // atau notif lain
  alarm.pause(); // Langsung stop
  alarm.currentTime = 0;
}
