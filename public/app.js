const STORAGE_KEY = 'aitests.tasks';

const taskForm = document.querySelector('#task-form');
const titleInput = document.querySelector('#task-title');
const taskList = document.querySelector('#task-list');
const emptyState = document.querySelector('#empty-state');
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = loadTasks();
let currentFilter = 'all';

renderTasks();

/**
 * Recupera las tareas almacenadas en localStorage.
 * @returns {Array<{id:string,title:string,completed:boolean,createdAt:string}>}
 */
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((task) => typeof task.id === 'string' && typeof task.title === 'string');
  } catch (error) {
    console.warn('No fue posible recuperar las tareas almacenadas:', error);
    return [];
  }
}

/**
 * Guarda las tareas en localStorage.
 */
function persistTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Agrega una nueva tarea.
 * @param {string} title
 */
function addTask(title) {
  const trimmed = title.trim();
  if (!trimmed) {
    return;
  }

  const newTask = {
    id: crypto.randomUUID(),
    title: trimmed,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks = [newTask, ...tasks];
  persistTasks();
  renderTasks();
}

/**
 * Actualiza una tarea por id.
 * @param {string} id
 * @param {Partial<{title: string; completed: boolean}>} updates
 */
function updateTask(id, updates) {
  let modified = false;
  tasks = tasks.map((task) => {
    if (task.id !== id) return task;
    modified = true;
    return { ...task, ...updates };
  });
  if (modified) {
    persistTasks();
    renderTasks();
  }
}

/**
 * Elimina una tarea por id.
 * @param {string} id
 */
function removeTask(id) {
  const nextTasks = tasks.filter((task) => task.id !== id);
  if (nextTasks.length !== tasks.length) {
    tasks = nextTasks;
    persistTasks();
    renderTasks();
  }
}

/**
 * Cambia el filtro activo y re-renderiza.
 * @param {'all'|'pending'|'completed'} filter
 */
function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });
  renderTasks();
}

function getVisibleTasks() {
  switch (currentFilter) {
    case 'pending':
      return tasks.filter((task) => !task.completed);
    case 'completed':
      return tasks.filter((task) => task.completed);
    default:
      return tasks;
  }
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  taskList.innerHTML = '';

  if (visibleTasks.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  const fragment = document.createDocumentFragment();

  visibleTasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .forEach((task) => {
      const item = document.createElement('li');
      item.className = `task ${task.completed ? 'completed' : ''}`;
      item.dataset.id = task.id;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = task.completed;
      checkbox.setAttribute('aria-label', `Marcar tarea "${task.title}" como completada`);

      const title = document.createElement('span');
      title.className = 'task-title';
      title.textContent = task.title;

      const actions = document.createElement('div');
      actions.className = 'task-actions';

      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'btn ghost';
      editButton.dataset.action = 'edit';
      editButton.textContent = 'Editar';

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'btn danger';
      deleteButton.dataset.action = 'delete';
      deleteButton.textContent = 'Eliminar';

      actions.append(editButton, deleteButton);
      item.append(checkbox, title, actions);
      fragment.appendChild(item);
    });

  taskList.appendChild(fragment);
}

// EVENTOS

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask(titleInput.value);
  taskForm.reset();
  titleInput.focus();
});

taskList.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const item = target.closest('li.task');
  if (!item) return;
  const id = item.dataset.id;
  if (!id) return;

  if (target.matches('button[data-action="edit"]')) {
    const currentTask = tasks.find((task) => task.id === id);
    const currentTitle = currentTask?.title ?? '';
    const nextTitle = prompt('Editar tarea', currentTitle);
    if (nextTitle !== null) {
      const trimmed = nextTitle.trim();
      if (trimmed) {
        updateTask(id, { title: trimmed });
      }
    }
  }

  if (target.matches('button[data-action="delete"]')) {
    const confirmed = confirm('¿Eliminar esta tarea?');
    if (confirmed) {
      removeTask(id);
    }
  }
});

taskList.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') return;
  const item = target.closest('li.task');
  if (!item?.dataset.id) return;
  updateTask(item.dataset.id, { completed: target.checked });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setFilter(button.dataset.filter ?? 'all');
  });
});

// Permite escuchar cambios realizados en otras pestañas del navegador
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY && event.newValue) {
    tasks = loadTasks();
    renderTasks();
  }
});
