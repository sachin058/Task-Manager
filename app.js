let tasks = [];

//checking for local file
(function fetchingDataFromFile() {
  let localfile = localStorage.getItem("tasks");

  try {
    if (localfile != null) {
      
      tasks = JSON.parse(localfile);
      
      renderTasks(tasks);
    } 
  } catch (err) {
    
    tasks = [];
  }
})();

// 6) Saving Tasks to memory

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks, null, 2));
}

// ---- Core Functions ----

// 1) Add Task
function addTask(title, description, dueDate, priority) {
  let newTask = {
    id: Date.now().toString(),
    title: title,
    description: description,
    dueDate: dueDate,
    priority: priority,
    completed: false,
    createdAt: new Date().toISOString(),
    
  };

  tasks.push(newTask);
  save();
  updateCount();
  renderTasks(tasks);
  return newTask;
}

// 2) List Tasks in console
function listTasks(array) {
  // TODO: return tasks
  for (let task of array) {
    console.log("id : ", task.id);
    console.log("Title :", task.title);
    console.log("Description : ", task.description);
    console.log("Due Date : ", task.dueDate);
    console.log("Priority :  ", task.priority);
    console.log("Is task completed ? : ", task.completed ? "✅" : "❌");
    console.log("Task Created on :", task.createdAt);
    
    console.log("\n\n");
  }
}


// 5) Delete Task
function deleteTask(id) {
  // TODO: remove by id
  let before = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);
  if (tasks.length !== before) {
    save();
  }

  renderTasks(tasks);
  updateCount();
  
}
//checking the task complete/incomplete....
function toggleCompleted(id) {
    
    console.log(id);
    let targetedTask = tasks.find((task) => task.id == id)
    targetedTask.completed = !targetedTask.completed;
    save();
    renderTasks(tasks);
}

// 8) Search fucntion... Not implemented yet

function search(str) {
  let searchRes = tasks.filter((task) =>
    task.title
      .toLowerCase()
      .replaceAll(" ", "")
      .includes(str.toLowerCase().replaceAll(" ", ""))
  );
  return searchRes;
}

//Global variables for sorting and filtering
let firstFilter = "all";
let secondFilter = "All Priority";
let thirdSorting = "Duedate";
let fourthReverse = false;

// 7) Filtering  based on work completion

function filterCompleted(result) {
  if (firstFilter == "all") {
    return result;
  } else if (firstFilter == "pending") {
    return result.filter((obj) => {
      return obj.completed == false;
    });
  } else if (firstFilter == "completed") {
    return result.filter((obj) => {
      return obj.completed == true;
    });
  } else {
    return result;
  }
}

//filtering based on priority
function filterPriority(result) {
  if (secondFilter == "All Priority") {
    return result;
  } else if (secondFilter == "High Priority") {
    return result.filter((obj) => {
      return obj.priority == "High";
    });
  } else if (secondFilter == "Medium Priority") {
    return result.filter((obj) => {
      return obj.priority == "Medium";
    });
  } else if (secondFilter == "Low Priority") {
    return result.filter((obj) => {
      return obj.priority == "Low";
    });
  } else {
    return result;
  }
}

// 9) Sorting tasks...

function sorting(result) {
  const priorityRank = { high: 3, medium: 2, low: 1 };

  if (thirdSorting == "Duedate") {
    return result.sort((a, b) => {
      return a.dueDate.localeCompare(b.dueDate);
    });
  } else if (thirdSorting == "Priority") {
    return result.sort(
      (a, b) =>
        priorityRank[b.priority.toLowerCase()] -
        priorityRank[a.priority.toLowerCase()]
    );
  } else if (thirdSorting == "Date Created") {
    return result.sort((a, b) => a.id.localeCompare(b.id));
  }
}

//reverse the list
function flip(result) {
  if (fourthReverse == true) {
    return result.reverse();
  }
  return result;
}

//reverse button...

let reverseButton = document.querySelector('#reverse-container');
let reverseIcon = document.querySelector('#reverse-icon');
reverseButton.addEventListener('click', ()=>{
      reverseIcon.classList.toggle('rotate');
      fourthReverse = !fourthReverse;
      filtersAll();
      
})

//Universal filter and sort funtion...
function filtersAll() {
  let result = [...tasks];
  result = filterCompleted(result);
  result = filterPriority(result);
  result = sorting(result);
  result = flip(result);
  renderTasks(result);
  return result;
}

//filters and sorting working..
let allButton = document.querySelector("#all-tasks-filter-button");
allButton.addEventListener("click", () => {
  firstFilter = "all";
  filtersAll();
});

let pendingButton = document.querySelector("#pending-tasks-filter-button");
pendingButton.addEventListener("click", () => {
  firstFilter = "pending";
  filtersAll();
});

let completedButton = document.querySelector("#completed-tasks-filter-button");
completedButton.addEventListener("click", () => {
  firstFilter = "completed";
  filtersAll();
});

let prioritySelector = document.querySelector("#priority-selector");
prioritySelector.addEventListener("change", () => {
  secondFilter = prioritySelector.value;

  filtersAll();
});

let generalSort = document.querySelector("#due-date-selector");
generalSort.addEventListener("change", () => {
  thirdSorting = generalSort.value;
  filtersAll();
});

//slider functionality

let slider = document.querySelector(".slider");
let buttons = document.querySelectorAll(".filter-button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    let index = button.dataset.index;

    if (index == 0) {
      slider.style.left = "0%";
      slider.style.width = "30%";
    } else if (index == 1) {
      slider.style.left = "32%";
      slider.style.width = "30%";
    } else if (index == 2) {
      slider.style.left = "65%";
      slider.style.width = "35%";
    }
  });
});

//accessing useful DOM elements....
let editTitle = document.querySelector("#task-title-edit");
let editDescription = document.querySelector("#description-edit");
let editPriority = document.querySelector("#priority-edit");
let editDueDate = document.querySelector("#due-date-edit");
let cancelButton = document.querySelector(".cancel-button");
let displayArea = document.querySelector(".display-area");
let form = document.querySelector("#edit-form");
let model = document.querySelector(".overlay");
let hiddenElement = 0;

//main function for event listener.....

displayArea.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-icon");
  const editButton = event.target.closest(".edit-icon");
  const toggleBox = event.target.closest('.checkbox');

  if (deleteButton) {
    let deleteElement = deleteButton.closest(".tasklist-container");
    deleteTask(deleteElement.id);
    console.log("Task Deleted");
  }

  else if (editButton) {
    editElement = editButton.closest(".tasklist-container");
    hiddenElement = editElement.id;

    tasks.forEach((task) => {
      if (task.id == editElement.id) {
        model.classList.remove("hidden");
        editTitle.value = task.title;
        editDescription.value = task.description;
        editPriority.value = task.priority;
        editDueDate.value = task.dueDate;
      }
    });
  }

  else if (toggleBox){
    console.log('toggle box is clicked..');
    let toggleElement = toggleBox.closest('.tasklist-container');
    toggleCompleted(toggleElement.id);
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  console.log(hiddenElement);
  tasks.forEach((task) => {
    if (task.id == hiddenElement) {
      task.title = editTitle.value;
      task.description = editDescription.value;
      task.priority = editPriority.value;
      task.dueDate = editDueDate.value;
      model.classList.add("hidden");
      save();
      renderTasks(tasks);
    }
  });
});

//cancel button
cancelButton.addEventListener("click", () => {
  model.classList.add("hidden");
});

//update count in website

function updateCount() {
  //counting all tasks... whether they are complete or not...
  let totalCount = tasks.length;
  let dueSoonCount = 0;
  let overdue = 0;
  let highPriorityCount = 0;
  let mediumPriorityCount = 0;
  let lowPriorityCount = 0;
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(today.getDate() + 2);
  tasks.forEach((task) => {
    let workdueDate = new Date(task.dueDate);

    if (workdueDate < dayAfterTomorrow && task.completed == false) {
        dueSoonCount++;
    }
    if (workdueDate < today && task.completed == false) {
      overdue++;
    }
    if (task.priority == "High" && task.completed == false) {
      highPriorityCount++;
    }
    if (task.priority == "Medium" && task.completed == false) {
      mediumPriorityCount++;
    }
    if (task.priority == "Low" && task.completed == false) {
      lowPriorityCount++;
    }
  });

  //upadting count in dom
  document.querySelector("#totaltasks").innerText = `${totalCount} Total`;
  document.querySelector(
    "#due-soon-value"
  ).innerText = `${dueSoonCount} Due Soon`;
  document.querySelector("#overdue-value").innerText = `${overdue} Overdue`;
  document.querySelector(
    "#high-priority-count-value"
  ).innerText = `${highPriorityCount} High`;
  document.querySelector(
    "#medium-priority-count-value"
  ).innerText = `${mediumPriorityCount} Medium`;
  document.querySelector(
    "#low-priority-count-value"
  ).innerText = `${lowPriorityCount} Low`;
}
updateCount();

//taking tasks form html inputs and passing them to the addtask functiont to save tasks.

function fetchTasks() {
  title = document.querySelector("#input-task-title").value;
  description = document.querySelector("#input-task-description").value;
  dueDate = document.querySelector("#input-task-duedate").value;
  priority = document.querySelector("#input-task-priority").value;

  if (title != "" && description != "" && dueDate != "") {
    addTask(title, description, dueDate, priority);
    document.querySelector("#input-task-title").value = "";
    document.querySelector("#input-task-description").value = "";
    document.querySelector("#input-task-duedate").value = "";
  } else {
    alert(`Don't leave input fields empty`);
  }
}

//add button event listener

let addTaskButton = document.querySelector("#add-task-button");
addTaskButton.addEventListener("click", fetchTasks);

//clear button functionality
let clearFieldbutton = document.querySelector("#clear-text-field-button");

clearFieldbutton.addEventListener("click", () => {
  document.querySelector("#input-task-title").value = "";
  document.querySelector("#input-task-description").value = "";
  document.querySelector("#input-task-duedate").value = "";
});

//Display task functionality

function renderTasks(tasks) {
  let parentcontainer = document.querySelector(".display-area");
  parentcontainer.innerHTML = "";

  tasks.forEach((task) => {
    let dueDateFlipped = new Date(task.dueDate);

    function prioritySwitcher() {
      if (task.priority == "High") {
        return `<div class="priority-label-high">
                <img src="image/white-warning.png">
                <p>High</p>
            </div>`;
      } else if (task.priority == "Low") {
        return `<div class="priority-label-low">
                <img src="image/danger.png">
                <p>Low</p>
            </div>`;
      } else {
        return `<div class="priority-label-medium">
                <img src="image/white-warning.png">
                <p>Medium</p>
            </div>`;
      }
    }

    const module = document.createElement("div");
    module.id = task.id;
    module.className = "tasklist-container";
    module.innerHTML = `
      
      <div>
            <input class="checkbox" type="checkbox" ${task.completed ? 'checked' : ""}>
        </div>

        <div class="task-info">
            <p class="tasklist-name" >${task.title}</p>
            <p class="tasklist-description">${task.description}</p>
            
            <div class="task-dates">
                
                <p>Due: ${dueDateFlipped.toLocaleDateString()}</p>
            </div>
        </div>

        <div class="task-edit-delete" >
            
            
        ${prioritySwitcher()}
            
            <div class="edit-icon" >
                <img src="image/edit.png" alt="">
            </div>
            <div class="delete-icon"  >
                <img src="image/remove.png" alt="">
            </div>
        </div>`;

    parentcontainer.append(module);
  });
}
