const toDo = document.getElementById("toDo");
const doing = document.getElementById("doing");
const done = document.getElementById("done");
const form = document.getElementById("form");
const btnForm = document.getElementById("btnForm");
const btnFinish = document.getElementById("btnFinish");

// DB_TODO
const localStoragetasksToDo = JSON.parse(localStorage.getItem("tasksToDo"));

let db_tasksToDo =
  localStorage.getItem("tasksToDo") !== null ? localStoragetasksToDo : [];

const setLocalStorageTaskToDo = () => {
  localStorage.setItem("tasksToDo", JSON.stringify(db_tasksToDo));
};

// DB_DOING
const localStoragetasksDoing = JSON.parse(localStorage.getItem("tasksDoing"));

let db_tasksDoing =
  localStorage.getItem("tasksDoing") !== null ? localStoragetasksDoing : [];

const setLocalStorageTaskDoing = () => {
  localStorage.setItem("tasksDoing", JSON.stringify(db_tasksDoing));
};

// DB_DONE
const localStoragetasksDone = JSON.parse(localStorage.getItem("tasksDone"));

let db_tasksDone =
  localStorage.getItem("tasksDone") !== null ? localStoragetasksDone : [];

const setLocalStorageTaskDone = () => {
  localStorage.setItem("tasksDone", JSON.stringify(db_tasksDone));
};

function submitForm(event) {
  event.preventDefault();
  let priority = "bg-emerald-500";
  const findByTaskTodo = db_tasksToDo.find(
    (item) => item.task === form[0].value
  );
  const findByTaskDoing = db_tasksDoing.find(
    (item) => item.task === form[0].value
  );
  const findByTaskDone = db_tasksDone.find(
    (item) => item.task === form[0].value
  );

  if (findByTaskTodo || findByTaskDoing || findByTaskDone) {
    alert("Task already exists!");
    return;
  }

  // Pegar valor do input radio
  const inputRadioValue = document.querySelector("input[name='radio']:checked");

  if (inputRadioValue)
    switch (inputRadioValue.value) {
      case "low":
        priority = "bg-emerald-500";
        break;
      case "medium":
        priority = "bg-yellow-500";
        break;
      case "high":
        priority = "bg-red-500";
        break;
      default:
        priority = "bg-emerald-500";
    }

  console.log(priority);

  const data = {
    task: form[0].value,
    priority: priority,
  };

  if (form[0].value) {
    createTask(data);
  } else {
    alert("Adicione uma tarefa para concluir a ação!");
  }
}

function createTask(task) {
  db_tasksToDo.push(task);
  setLocalStorageTaskToDo();

  location.reload();
  readTask();
}

// RENDER CARDS
function readTask() {
  renderTasksTodo();
}
readTask();

function renderTasksTodo() {
  const tasksToDoTemplate = db_tasksToDo
    .map(
      (task) => `
    <div id="${task.task}" draggable="true" class="card hover:cursor-move ${task.priority} p-4 rounded">
    <div class="flex justify-between items-center px-4">
      <p>${task.task}</p>
      <button onclick="handleDelete('${task.task}')"><img src="./src/assets/excluir.png" alt="excluir" /></button>
    </div>
  </div>`
    )
    .join("");

  const tasksDoingTemplate = db_tasksDoing
    .map(
      (task) => `
    <div id="${task.task}" draggable="true" class="card ${task.priority} p-4 rounded">
    <div class="flex justify-between items-center px-4">
      <p>${task.task}</p>
      <button onclick="handleDelete('${task.task}')"><img src="./src/assets/excluir.png" alt="excluir" /></button>
    </div>
  </div>`
    )
    .join("");

  const tasksDoneTemplate = db_tasksDone
    .map(
      (task) => `
    <div id="${task.task}" draggable="true" class="card ${task.priority} p-4 rounded">
    <div class="flex justify-between items-center px-4">
      <p>${task.task}</p>
      <button onclick="handleDelete('${task.task}')"><img src="./src/assets/excluir.png" alt="excluir" /></button>
    </div>
  </div>`
    )
    .join("");

  toDo.innerHTML = tasksToDoTemplate;
  doing.innerHTML = tasksDoingTemplate;
  done.innerHTML = tasksDoneTemplate;
  setLocalStorageTaskToDo();
}

// UPDATE TASK
function updateTask(index, newTask) {
  db_tasksToDo[index].task = newTask;

  location.reload();
  readTask();
}

// DELETE TASK
function handleDelete(elementTask) {
  deleteTask(elementTask);
}

function deleteTask(task) {
  const findByTaskTodo = db_tasksToDo.filter((item) => item.task !== task);
  const findByTaskDoing = db_tasksDoing.filter((item) => item.task !== task);
  const findByTaskDone = db_tasksDone.filter((item) => item.task !== task);

  const confirmation = confirm("Do you really want to delete this task?");

  if (!confirmation) {
    return;
  }

  db_tasksToDo = findByTaskTodo;
  setLocalStorageTaskToDo();

  db_tasksDoing = findByTaskDoing;
  setLocalStorageTaskDoing();

  db_tasksDone = findByTaskDone;
  setLocalStorageTaskDone();

  // location.reload();
  readTask();
}

// DRAG AND DROP

const cards = document.querySelectorAll(".card");
const dropZones = document.querySelectorAll(".dropZone");

cards.forEach((card) => {
  card.addEventListener("dragstart", dragstart);
  card.addEventListener("dragend", dragend);
});

function dragstart() {
  dropZones.forEach((dropZone) => (dropZone.style.background = "#eee1"));

  this.classList.add("is-dragging");
  this.style.cursor = "move";
  this.style.opacity = "0.3";
}

function handleMoveTask(card, dropZone) {
  const removeTaskTodo = db_tasksToDo.filter((item) => item.task !== card.id);
  const removeTaskDoing = db_tasksDoing.filter((item) => item.task !== card.id);
  const removeTaskDone = db_tasksDone.filter((item) => item.task !== card.id);

  const findByTaskTodo = db_tasksToDo.find((item) => item.task === card.id);
  const findByTaskDoing = db_tasksDoing.find((item) => item.task === card.id);
  const findByTaskDone = db_tasksDone.find((item) => item.task === card.id);

  if (dropZone.id === "doing") {
    if (findByTaskTodo || findByTaskDone) {
      db_tasksDoing.push(findByTaskTodo || findByTaskDone);
      setLocalStorageTaskDoing();
    }

    db_tasksToDo = removeTaskTodo;
    setLocalStorageTaskToDo();

    db_tasksDone = removeTaskDone;
    setLocalStorageTaskDone();
    return;
  }

  if (dropZone.id === "done") {
    if (findByTaskTodo || findByTaskDoing) {
      db_tasksDone.push(findByTaskTodo || findByTaskDoing);
      setLocalStorageTaskDone();
    }

    db_tasksToDo = removeTaskTodo;
    setLocalStorageTaskToDo();

    db_tasksDoing = removeTaskDoing;
    setLocalStorageTaskDoing();
    return;
  }

  if (dropZone.id === "toDo") {
    if (findByTaskDone || findByTaskDoing) {
      db_tasksToDo.push(findByTaskDoing || findByTaskDone);
      setLocalStorageTaskToDo();
    }

    db_tasksDoing = removeTaskDoing;
    setLocalStorageTaskDoing();

    db_tasksDone = removeTaskDone;
    setLocalStorageTaskDone();
    return;
  }
}

function dragend() {
  dropZones.forEach((dropZone) => (dropZone.style.background = ""));

  handleMoveTask(this, this.parentNode);

  this.classList.remove("is-dragging");
  this.style.cursor = "";
  this.style.background = "";
  this.style.opacity = "";
}

dropZones.forEach((dropZone) => {
  dropZone.addEventListener("dragover", dragover);
  dropZone.addEventListener("dragleave", dragleave);
  // dropZone.addEventListener("dragend", dragend);
});

function dragleave() {
  this.style.background = "#eee1";
}

function dragover(e) {
  this.style.background = "#4cd13711";
  const cardBeingDragged = document.querySelector(".is-dragging");

  const applyAfter = getNewPosition(this, e.clientY);

  if (applyAfter) {
    applyAfter.insertAdjacentElement("afterend", cardBeingDragged);
  } else {
    this.prepend(cardBeingDragged);
  }
}

function getNewPosition(dropZone, posY) {
  const items = dropZone.querySelectorAll(".card:not(.is-dragging)");
  let result;

  for (let refer_card of items) {
    const box = refer_card.getBoundingClientRect();
    const boxCenterY = box.y + box.height / 2;

    if (posY >= boxCenterY) result = refer_card;
  }

  return result;
}

function finishTasks() {
  const result = confirm(
    "After confirmation, all completed tasks will be deleted."
  );

  if (result) {
    db_tasksDone = [];
    setLocalStorageTaskDone();
    location.reload();
  }
}

// EVENTS
btnForm.addEventListener("click", submitForm);
btnFinish.addEventListener("click", finishTasks);
