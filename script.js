// Selectors
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render tasks
function renderTasks(filter = 'all') {
  taskList.innerHTML = '';
  let filteredTasks = tasks;

  if (filter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (filter === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <span>${task.text}</span>
      <button onclick="deleteTask(${index})">&times;</button>
    `;

    li.querySelector('span').addEventListener('click', () => toggleComplete(index));

    taskList.appendChild(li);
  });
}

// Add task
addTaskBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (text === '') return;
  tasks.push({ text, completed: false });
  updateLocalStorage();
  taskInput.value = '';
  renderTasks(getActiveFilter());
});

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  updateLocalStorage();
  renderTasks(getActiveFilter());
}

// Toggle complete
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  updateLocalStorage();
  renderTasks(getActiveFilter());
}

// Update localStorage
function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTasks(btn.dataset.filter);
  });
});

function getActiveFilter() {
  return document.querySelector('.filter-btn.active').dataset.filter;
}

// Initial render
renderTasks();

// 3D Tilt effect
taskList.addEventListener('mousemove', e => {
  const item = e.target.closest('.task-item');
  if (!item) return;

  const rect = item.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * 5;
  const rotateY = ((x - centerX) / centerX) * 5;

  item.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
});

taskList.addEventListener('mouseleave', e => {
  const item = e.target.closest('.task-item');
  if (item) item.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
});

taskList.addEventListener('mouseout', e => {
  const item = e.target.closest('.task-item');
  if (item) item.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
});
