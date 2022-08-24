// Global vairables to handle functions
let database = JSON.parse(localStorage.getItem("philo-check")) || {};
let canvasContainer = document.querySelector(".meters .content"),
  tasksContainer = document.querySelector(".list"),
  taskCounter = document.querySelector(".list .header span.tasks"),
  plusBtn = document.getElementById("plusTasks"),
  categories = {},
  addForm = document.querySelector(".add"),
  addFormTitle = document.querySelector(".add h2"),
  addTitle = document.getElementById("inputTitle"),
  addCategory = document.getElementById("inputCategory"),
  addColor = document.getElementById("inputColor"),
  addDate = document.getElementById("inputDate"),
  addTime = document.getElementById("inputTime"),
  addAMPM = document.getElementById("selectAMPM"),
  buttonHolder = document.querySelector(".add .button-holder"),
  createBtn = document.getElementById("createBtn"),
  cancelBtn = document.getElementById("cancelBtn"),
  editBtn = document.getElementById("editBtn"),
  deleteBtn = document.getElementById("deleteBtn"),
  dayTitle = document.querySelector(".list .header span.day"),
  dayTitleNum = document.querySelector(".list .header span.num-day"),
  monthTitle = document.querySelector(".list .header span.month"),
  prevDayBtn = document.getElementById("prevDay"),
  nextDayBtn = document.getElementById("nextDay"),
  dates = {},
  dateNow = "";

// Write Database
function write(data) {
  localStorage.setItem("philo-check", JSON.stringify(data));
}

// Variables for the title of days and months to display
let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let monthDays = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
  "13th",
  "14th",
  "15th",
  "16th",
  "17th",
  "18th",
  "19th",
  "20th",
  "21st",
  "22nd",
  "23rd",
  "24th",
  "25th",
  "26th",
  "27th",
  "28th",
  "29th",
  "30th",
  "31st",
];
let months = [
  "Janurary",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// When click on the plus button in tasks list: Show Add/Edit Div
plusBtn.addEventListener("click", () => (addForm.style.display = "block"));

// When click on the create button in Add/Edit div: Create A Task
createBtn.addEventListener("click", add);

// When click on the cancel button in Add/Edit div: Hide Add/Edit div and delete all assigned value
cancelBtn.addEventListener("click", reset);

// When click on the prev arrow in tasks list: Display previous day tasks
prevDayBtn.addEventListener("click", () => {
  let datesKeys = Object.keys(dates);
  let iNow = datesKeys.findIndex((date) => {
    if (dateNow == date) return true;
  });
  let prev = datesKeys[iNow - 1];

  // Update tasks list
  updateList(prev);
});

// When click on the next arrow in tasks list: Display next day tasks
nextDayBtn.addEventListener("click", () => {
  let datesKeys = Object.keys(dates);
  let iNow = datesKeys.findIndex((date) => {
    if (dateNow == date) return true;
  });
  let next = datesKeys[iNow + 1];

  // Update tasks list
  updateList(next);
});

// Loop on each entry in database to handle create the page onload
for (id in database) {
  // Create a task and add it in tasks list
  create(
    id,
    database[id].title,
    database[id].category,
    database[id].check,
    database[id].color,
    database[id].date,
    format12(database[id].time)
  );

  // Condition: If there is a category named in the "Categories" object
  if (categories[database[id].category]) {
    // Add task to the category
    categories[database[id].category].push({ element: database[id], id: id });
  } else {
    // Create new category and add task to it
    categories[database[id].category] = [{ element: database[id], id: id }];
  }

  // Condition: If there is a date named in the "Dates" object
  if (dates[database[id].date]) {
    // Add task to the date
    dates[database[id].date].push({ element: database[id], id: id });
  } else {
    // Create new Date and add task to it
    dates[database[id].date] = [{ element: database[id], id: id }];
  }

  // Sort tasks in tasks list
  sortList();
}

// Sort tasks by date
sortDates();

// Assign "dateNow" variable to the first date in "Dates" object
dateNow = Object.keys(dates)[0];

// Update tasks list
updateList(dateNow);

// For each category in the "Categories" object
for (category in categories) {
  // Create a meter
  loadMeter(category);
}

// Function to generate a unique id for the tasks
function generateId() {
  let abc = "ABCDEFGHIJKLMNOPQRSTUVWYZ".split("");
  let firstChar = abc[Math.floor(Math.random() * abc.length)];
  let secoundChar = Math.round(Math.random() * 9);
  let thirdChar = Math.round(Math.random() * 9);
  let lastChar = abc[Math.floor(Math.random() * abc.length)];
  let id = `${firstChar}${secoundChar}${thirdChar}${lastChar}`;

  // Condition: if this id is already exist
  if (database[id]) {
    // Re-execute the function
    generateId();
  } else {
    // Return the id
    return id;
  }
}

// Function to convert 24-hour time format to 12-hour time format
function format12(time) {
  let hours = time.match(/\d{2}(?=\:)/g)[0];
  let minutes = time.match(/(?<=\d{2}\:)\d{2}/g)[0];

  // Condition: If hours is bigger than 12
  if (parseInt(hours) > 12) {
    // Minus hours 12 and put hours in PM
    let newhour = parseInt(hours) - 12;

    // Condition: If hours-12 smaller than 10
    if (newhour < 10) {
      // Add zero on begin of the hours String
      newhour = "0" + newhour;
    }
    return `${newhour}:${minutes} PM`;
  } else if (parseInt(hours) == 12) {
    // If hours equal 12 put hours in PM
    return `${hours}:${minutes} PM`;
  } else if (parseInt(hours) == 0) {
    // If hours equal zero make hours equal 12 and put hours in AM
    return `12:${minutes} AM`;
  } else {
    // If nothing of the previous put hours in AM
    return `${hours}:${minutes} AM`;
  }
}

// Function to create task and add it to the tasks list
function create(id, title, category, check, color, date, time) {
  let task = document.createElement("div");
  task.classList.add("item");
  task.setAttribute("id", id);
  task.setAttribute("date", date);

  let categoryBar = document.createElement("div");
  categoryBar.classList.add("bar");
  categoryBar.style.backgroundColor = color;
  categoryBar.textContent = category;

  let checkbox = document.createElement("input");
  checkbox.classList.add("check");
  checkbox.setAttribute("type", "checkbox");
  if (check == "true") checkbox.checked = true;
  else checkbox.checked = false;

  let name = document.createElement("span");
  name.classList.add("title");
  name.textContent = title;

  let timeE = document.createElement("span");
  timeE.classList.add("time");
  timeE.textContent = time;

  task.append(categoryBar, checkbox, name, timeE);
  tasksContainer.appendChild(task);

  // When check/uncheck: Update the database and update meter
  checkbox.addEventListener("change", () => {
    let id = checkbox.parentElement.getAttribute("id");

    // Condition: if task is checked
    if (checkbox.checked) {
      // check on the database and meter
      database[id].check = "true";
      updateMeter(database[id].category, "plus");
    } else {
      // uncheck on the database and meter
      database[id].check = "false";
      updateMeter(database[id].category, "minus");
    }

    // Send new data to the database
    write(database);
  });

  // When click on the task element
  task.addEventListener("click", (e) => {
    // Condition: If click is on task element itself not on its childs
    if (e.currentTarget == e.target) {
      // Hide create button from Add/Edit div
      createBtn.style.display = "none";

      // Show edit button on Add/Edit div
      editBtn.style.display = "block";

      // Show delete button on Add/Edit div
      deleteBtn.style.display = "block";

      // Assign Add/Edit div for editing
      let id = e.target.getAttribute("id");
      addTitle.value = database[id].title;
      addCategory.value = database[id].category;
      addColor.value = database[id].color;
      addDate.value = database[id].date;
      addTime.value = database[id].time;

      // When click edit button: Edit
      editBtn.onclick = () => {
        edit(id);
      };

      // When click delete button: Delete
      deleteBtn.onclick = () => {
        del(id);
      };

      // Change the title in Add/Edit div
      addFormTitle.textContent = `Edit ${database[id].title} Task!`;

      // Show Add/Edit div
      addForm.style.display = "block";
    }
  });
}

// Function to create task and assign it to the database
function createDatabase(id, title, category, check, color, date, time) {
  // Make database object
  database[id] = {
    title: title,
    category: category,
    check: check,
    color: color,
    date: date,
    time: time,
  };

  // Update the database
  write(database);
}

// Function to create/update meter
function createCanvas(name, percentage, edit, oldPercentage) {
  let canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 300;
  canvas.setAttribute("id", name);

  let ctx = canvas.getContext("2d");
  let degrees = Math.PI / 180;

  // This variable to animate and stop at a point
  let i = 0;

  // Start Animation
  requestAnimationFrame(draw);

  // Function to draw the canvas
  function draw() {
    ctx.clearRect(0, 0, 300, 300);
    ctx.save();

    ctx.lineWidth = 20;
    ctx.strokeStyle = "#f3f4f6";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(150, 150, 120, 150 * degrees, 390 * degrees);
    ctx.stroke();

    ctx.setLineDash([3, 29]);
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(150, 150, 100, 150 * degrees, 390 * degrees);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#e5e7eb";
    ctx.beginPath();
    ctx.arc(150, 150, 14, 0, 360 * degrees);
    ctx.fill();

    let gradient = ctx.createLinearGradient(0, 300, 0, 0);
    gradient.addColorStop(0, "#3f78f3");
    gradient.addColorStop(0.4, "#3f78f3");
    gradient.addColorStop(0.8, "#e91e63");
    gradient.addColorStop(1, "#fe9800");
    ctx.fillStyle = gradient;

    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.strokeStyle = gradient;
    ctx.beginPath();
    ctx.arc(150, 150, 120, 150 * degrees, ((i / 100) * 240 + 150) * degrees);
    ctx.stroke();

    ctx.fillStyle = "#f43f5e";
    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate((i / 100) * 240 * degrees);
    ctx.beginPath();
    ctx.moveTo(5, 2);
    ctx.lineTo(-70, 38);
    ctx.lineTo(0, -6);
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(150, 150, 5, 0, 360 * degrees);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(150, 150, 3, 0, 360 * degrees);
    ctx.fill();

    ctx.fillStyle = "#374151";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${percentage}%`, 150, 240);

    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.font = "18px Arial";
    ctx.fillText(name, 150, 100);
    ctx.restore();

    let myReq = requestAnimationFrame(draw);

    // Condition: If the function run for update not for create
    if (edit) {
      // Condition: If percentage bigger than old percentage
      if (percentage > oldPercentage) {
        // Condition: If "i" vairable smaller than or equal percentage
        if (i <= percentage) {
          i++;
        } else {
          // Stop Animation at this point
          cancelAnimationFrame(myReq);
        }
      } else {
        // Condition: If "i" variable bigger than percentage
        if (i > percentage) {
          i--;
        } else {
          // Stop Animation at this point
          cancelAnimationFrame(myReq);
        }
      }
    } else {
      // Condition: If "i" vairable smaller than or equal percentage
      if (i <= percentage) {
        // Plus "i" variable
        i++;
      } else {
        // Stop Animation at this point
        cancelAnimationFrame(myReq);
      }
    }
  }
  // Condition: If the function run for update not for create
  if (edit) {
    // Assign "canvas" variable to the update canvas
    canvas = document.getElementById(name);
    // Assign "ctx" variable to the update canvas
    ctx = canvas.getContext("2d");
    // Assign "i" variable to the old percentage to seem like its completing the animation on update
    i = oldPercentage - 1;

    // Start Animation
    requestAnimationFrame(draw);
  }

  // Reutrn the created/updated canvas (not necessary on update)
  return canvas;
}

// Function to configure data to create meter
function loadMeter(name, insertBefore) {
  // Variable to know the checked tasks number
  let numCheck = 0;
  categories[name].forEach((task) => {
    if (task.element.check == "true") numCheck++;
  });

  // The created canvas
  let canvas = createCanvas(name, Math.round((numCheck / categories[name].length) * 100));

  // Add canvas to the page
  canvasContainer.insertBefore(canvas, insertBefore);

  // Sort the meters alphabetically
  sortMeter();
}

// Function to configure data to update meter
function updateMeter(name, sign) {
  let oldPercentage = 0;

  // Variable to know the checked tasks number
  let numCheck = 0;
  categories[name].forEach((task) => {
    if (task.element.check == "true") numCheck++;
  });

  // Condition: If the function is called for plus
  if (sign == "plus") {
    // Old percentage equal previous percentage based on "Categories" object
    oldPercentage = Math.round(((numCheck - 1) / categories[name].length) * 100);
  } else {
    // Old percentage equal next percentage based on "Categories" object
    oldPercentage = Math.round(((numCheck + 1) / categories[name].length) * 100);
  }

  let percentage = Math.round((numCheck / categories[name].length) * 100);

  // Condition: If the old percentage in range from 0 to 100
  if (oldPercentage > 0 && oldPercentage < 100) {
    // Update Meter Safely
    createCanvas(name, percentage, true, oldPercentage);
  } else if (oldPercentage == 100 && sign != "plus") {
    // If old percentage equal 100 and not need to plus: Update Meter Safely
    createCanvas(name, percentage, true, oldPercentage);
  } else if (oldPercentage == 0 && sign != "minus") {
    // If old percentage equal 0 and not need to minus: Update Meter Safely
    createCanvas(name, percentage, true, oldPercentage);
  }

  // Sort the meters alphabetically
  sortMeter();
}

// Function to sort meters in page
function sortMeter() {
  // All meters (type: Array)
  let meters = Array.from(canvasContainer.children);

  // All Meters Id (type: Array)
  let arr = meters.map((meter) => {
    return meter.getAttribute("id");
  });

  // Sort meters id array
  arr.sort();

  // Loop on each id
  arr.forEach((id, i) => {
    // Get the meter has this id
    let meter = meters.find((meter) => {
      if (meter.getAttribute("id") == id) return true;
    });

    // Sort it based on index
    meter.style.order = i + 1;
  });
}

// Function to sort task in tasks list
function sortList() {
  // All tasks (type: Array)
  let tasks = Array.from(tasksContainer.children);

  // Delete first child because it "header" no a task
  tasks.splice(0, 1);

  // Sort tasks array
  tasks.sort((a, b) => {
    let timeA = database[a.getAttribute("id")].time,
      timeB = database[b.getAttribute("id")].time;

    let hoursA = parseInt(timeA.match(/^(\d{2}(?=\:))/g)[0]) * 60,
      minutesA = parseInt(timeA.match(/(?<=\d{2}\:)\d{2}/g)[0]),
      totalA = hoursA + minutesA;

    let hoursB = parseInt(timeB.match(/^(\d{2}(?=\:))/g)[0]) * 60,
      minutesB = parseInt(timeB.match(/(?<=\d{2}\:)\d{2}/g)[0]),
      totalB = hoursB + minutesB;

    return totalA - totalB;
  });

  // Each task in "tasks"
  tasks.forEach((task, i) => {
    // Sort it based on index
    task.style.order = i + 1;
  });
}

// Function to update tasks list
function updateList(date) {
  // All tasks (type: Array)
  let tasks = Array.from(document.querySelectorAll(".list .item"));

  // Condition: If the function called with specific date
  if (date) {
    // Sort Dates In Page
    sortDates();

    // Loop on each task
    tasks.forEach((task) => {
      let id = task.getAttribute("id");

      // Hide All Tasks
      task.style.display = "none";

      // Condition: If task date equal the specific "date"
      if (database[id].date == date) {
        // Show this task
        task.style.display = "";
      }
    });

    let year = parseInt(date.match(/^(\d{4}(?=\-))/g)[0]),
      month = parseInt(date.match(/(?<=\d{4}\-)\d{2}(?=\-)/g)[0]),
      day = parseInt(date.match(/((?<=\d{4}\-\d{2}\-)\d{2})$/g)[0]);
    let newDate = new Date(year, month - 1, day);

    // Assign day title
    dayTitle.textContent = `${weekDays[newDate.getDay()]}, `;

    // Assign day num
    dayTitleNum.textContent = `${monthDays[newDate.getDate() - 1]}`;

    // Assign month title
    monthTitle.textContent = `${months[newDate.getMonth()]}`;

    // Assign "dateNow" variable to the specific "date"
    dateNow = date;

    // Count the displayed tasks in tasks list and show it to user
    countTasks();
  }
}

// Function to sort dates in page
function sortDates() {
  // New sorted object
  let datesSort = {};

  // All dates in "dates" object Variable
  let arrSort = Object.keys(dates);

  // Sort dates
  arrSort.sort((a, b) => {
    let yearsA = parseInt(a.match(/^(\d{4}(?=\-))/g)[0]) * 365,
      monthsA = parseInt(a.match(/(?<=\d{4}\-)\d{2}(?=\-)/g)[0]) * 30,
      daysA = parseInt(a.match(/((?<=\d{4}\-\d{2}\-)\d{2})$/g)[0]),
      totalA = yearsA + monthsA + daysA;

    let yearsB = parseInt(b.match(/^(\d{4}(?=\-))/g)[0]) * 365,
      monthsB = parseInt(b.match(/(?<=\d{4}\-)\d{2}(?=\-)/g)[0]) * 30,
      daysB = parseInt(b.match(/((?<=\d{4}\-\d{2}\-)\d{2})$/g)[0]),
      totalB = yearsB + monthsB + daysB;

    return totalA - totalB;
  });

  // Assign sorted dates values
  arrSort.forEach((date) => {
    datesSort[date] = dates[date];
  });

  // Set "dates" object to the new sorted object "datesSort"
  dates = datesSort;
}

// Function to count the displayed tasks in tasks list
function countTasks() {
  let arrShowed = Array.from(tasksContainer.children).filter((task) => {
    if (task.style.display == "") return true;
  });
  taskCounter.textContent = arrShowed.length - 1;
}

// Function to add new task (database / tasks list / meter )
function add() {
  // Condition: Validate all add value
  if (validate()) {
    let id = generateId();

    // Create task and add it in tasks list
    create(
      id,
      addTitle.value,
      addCategory.value,
      "false",
      addColor.value,
      addDate.value,
      format12(addTime.value)
    );

    // Create task and assign it to database
    createDatabase(
      id,
      addTitle.value,
      addCategory.value,
      "false",
      addColor.value,
      addDate.value,
      addTime.value
    );

    // Condition: If there is a category named in the "Categories" object
    if (categories[database[id].category]) {
      // Add task to the category
      categories[database[id].category].push({ element: database[id], id: id });

      // Minus the meter that it added the task to
      updateMeter(database[id].category, "minus");
    } else {
      // Create new category and add task to it
      categories[database[id].category] = [{ element: database[id], id: id }];

      // Create new meter and add it on the page
      loadMeter(addCategory.value);
    }

    // Condition: If there is a date named in the "Dates" object
    if (dates[database[id].date]) {
      // Add task to the date
      dates[database[id].date].push({ element: database[id], id: id });
    } else {
      // Create new Date and add task to it
      dates[database[id].date] = [{ element: database[id], id: id }];
    }

    // Update tasks list
    updateList(database[id].date);

    // Hide Add/Edit div
    addForm.style.display = "";

    // Sort tasks in tasks list
    sortList();
  }
}

// Function to edit task (database / tasks list / meter )
function edit(id) {
  // Condition: Validate all add value
  if (validate()) {
    let oldCategory = database[id].category;
    let oldCanvas = document.getElementById(oldCategory);

    let oldDate = database[id].date;

    // Edit Database
    database[id].title = addTitle.value;
    database[id].category = addCategory.value;
    database[id].color = addColor.value;
    database[id].date = addDate.value;
    database[id].time = addTime.value;

    // Send new data to the database
    write(database);

    let bar = document.querySelector(`.list .item#${id} .bar`);
    let title = document.querySelector(`.list .item#${id} .title`);
    let time = document.querySelector(`.list .item#${id} .time`);

    // Edit task in tasks list
    bar.style.backgroundColor = database[id].color;
    bar.textContent = database[id].category;
    title.textContent = database[id].title;
    time.textContent = format12(database[id].time);

    // Condition: If there is change in category
    if (oldCategory !== database[id].category) {
      // Condition: If there is a category named in the "Categories" object
      if (categories[database[id].category]) {
        // Add task to the category
        categories[database[id].category].push({
          element: database[id],
          id: id,
        });

        // Condition: If the task is checked
        if (database[id].check == "true") {
          // Plus the meter that has the task
          updateMeter(database[id].category, "plus");
        } else if (database[id].check == "false") {
          // Minus the meter that has the task
          updateMeter(database[id].category, "minus");
        }
      } else {
        // Create new category and add task to it
        categories[database[id].category] = [{ element: database[id], id: id }];

        // Create new meter and add it on the page
        loadMeter(database[id].category, oldCanvas.nextElementSibling);
      }

      // Condition: If there is only one task in old category
      if (categories[oldCategory].length <= 1) {
        // Delete the old category from "Categories" object
        delete categories[oldCategory];

        // Delete old meter from the page
        oldCanvas.remove();
      } else {
        let taskIndex = categories[oldCategory].findIndex((object) => {
          if (object.id == id) return true;
        });

        // Delete the task from old category in "Categories" object
        categories[oldCategory].splice(taskIndex, 1);

        // Condition: If task is checked
        if (database[id].check == "true") {
          // Minus the old meter that has the task
          updateMeter(oldCategory, "minus");
        } else {
          // Plus the old meter that has the task
          updateMeter(oldCategory, "plus");
        }
      }
    }

    // Condition: If there is change in date
    if (oldDate !== database[id].date) {
      // Condition: If there is a date named in the "Dates" object
      if (dates[database[id].date]) {
        // Add task to the date
        dates[database[id].date].push({ element: database[id], id: id });
      } else {
        // Create new Date and add task to it
        dates[database[id].date] = [{ element: database[id], id: id }];
      }

      // Condition: If there is only one task in old date
      if (dates[oldDate].length <= 1) {
        // Delete the old date from "Dates" object
        delete dates[oldDate];
      } else {
        let taskIndex = dates[oldDate].findIndex((object) => {
          if (object.id == id) return true;
        });
        // Delete the task from old date in "Dates" object
        dates[oldDate].splice(taskIndex, 1);
      }

      // Update the tasks list
      updateList(database[id].date);
    }
    // Hide Add/Edit div and delete all assigned value
    reset();

    // Sort tasks in tasks list
    sortList();
  }
}

// Function to delete task (database / tasks list / meter )
function del(id) {
  // Condition: If there is only one task in category
  if (categories[database[id].category].length <= 1) {
    // Delete meter from the page
    document.getElementById(database[id].category).remove();

    // Delete the category from "Categories" object
    delete categories[database[id].category];
  } else {
    let taskIndex = categories[database[id].category].findIndex((object) => {
      if (object.id == id) return true;
    });
    // Delete the task from category in "Categories" object
    categories[database[id].category].splice(taskIndex, 1);

    // Condition: If the task is checked
    if (database[id].check == "true") {
      // Minus the meter that has the task
      updateMeter(database[id].category, "minus");
    } else {
      // Plus the meter that has the task
      updateMeter(database[id].category, "plus");
    }

    // Update tasks list
    updateList(database[id].date);
  }

  // Delete task from tasks list
  document.getElementById(id).remove();

  // Condition: If there is only one task in date
  if (dates[database[id].date].length <= 1) {
    // Delete the date from "Dates" object
    delete dates[database[id].date];

    // Condition: If there is other date
    if (Object.keys(dates)[0]) {
      // Select the first date
      updateList(Object.keys(dates)[0]);
    } else {
      // Show no list to the user
      dayTitle.textContent = "No List";
      dayTitleNum.textContent = "";
      monthTitle.textContent = "";

      // Count the displayed tasks in tasks list and show it to user
      countTasks();
    }
  } else {
    let taskIndex = dates[database[id].date].findIndex((object) => {
      if (object.id == id) return true;
    });
    // Delete the task from date in "Dates" object
    dates[database[id].date].splice(taskIndex, 1);

    // Update tasks list
    updateList(database[id].date);
  }

  // Delete task from database
  delete database[id];

  // Send new data to the database
  write(database);

  // Hide Add/Edit div and delete all assigned value
  reset();

  // Sort tasks in tasks list
  sortList();
}

// Function to validate Add/Edit div values
function validate() {
  // Condition:
  if (addTitle.value == "") {
    // If title is empty
    alert("Title Filed Empty !!");
  } else if (addCategory.value == "") {
    // If category is empty
    alert("Category Filed Empty !!");
  } else if (addColor.value == "") {
    // If color is empty
    alert("Color Filed Empty !!");
  } else if (addDate.value == "") {
    // If date is empty
    alert("Date Filed Empty !!");
  } else if (addTime.value == "") {
    // If time is empty
    alert("Time Filed Empty !!");
  } else {
    // Nothing of this return that all value is "true"
    return true;
  }
  return false;
}

// Function to hide Add/Edit div and reset all its values
function reset() {
  // Hide Add/Edit div
  addForm.style.display = "";

  // Change Add/Edit div Title
  addFormTitle.textContent = "Create New Task!";

  // Empty title field in Add/Edit div
  addTitle.value = "";

  // Empty category field in Add/Edit div
  addCategory.value = "";

  // Empty color field in Add/Edit div
  addColor.value = "#000000";

  // Empty date field in Add/Edit div
  addDate.value = "";

  // Empty time field in Add/Edit div
  addTime.value = "";

  // Show create button Add/Edit div
  createBtn.style.display = "";

  // Show cancel button Add/Edit div
  cancelBtn.style.display = "";

  // Hide edit button Add/Edit div
  editBtn.style.display = "";

  // Hide delete button Add/Edit div
  deleteBtn.style.display = "";
}
