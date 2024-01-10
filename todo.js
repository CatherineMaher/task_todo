let day = document.querySelector("#day");
let month = document.querySelector("#month");
let year = document.querySelector("#year");
let addbtn = document.querySelector("#submit");
let p = document.querySelector("#tskdis");
let ttl = document.querySelector("#ttl");
let hr = document.querySelector("#hrs");
let min = document.querySelector("#mins");
let x = document.querySelector("#x");
let tsk = document.querySelector("#spanX");
const notifyButton = document.querySelector("#noti");
let dateObject;
const currentDate = new Date();

const defaultDay = currentDate.getDate();
const defaultMonth = currentDate.getMonth() + 1;
const defaultYear = currentDate.getFullYear();
const defaultHour = currentDate.getHours();
const defaultMinute = currentDate.getMinutes();
day.innerHTML = defaultDay;

var monthNames = [
  "January",
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

document.addEventListener("DOMContentLoaded", function () {
  let tasks = idbApp.getAllTasks();

  hr.value = defaultHour;
  min.value = defaultMinute;

  tasks.then(function (tasks) {
    if (tasks.length > 0) {
      tasks.forEach((task) => {
        tasksDisplay(task);
      });
    }
  });

  for (let i = 1; i <= 31; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.innerText = i;
    day.appendChild(option);
  }
  for (let i = 0; i < monthNames.length; i++) {
    var option = document.createElement("option");
    option.value = monthNames[i];
    option.innerText = monthNames[i];
    month.appendChild(option);
  }
  for (let i = 2001; i <= 2025; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.innerText = i;
    year.appendChild(option);
  }
  day.value = defaultDay;
  month.value = monthNames[defaultMonth - 1];
  year.value = defaultYear;

  function tasksDisplay(obj) {
    p.innerHTML += 
    ` <div id="${obj.id}" class="taskTodo ${obj.notified ? "done" : ""}">
        <span id='title'>${obj.taskTitle}
        </span><br>
        <span id='time'>
         ${obj.hr}:${obj.min}, ${
          obj.month
        } ${obj.day}th ${
          obj.year}
          </span>
        <span id="spanX"><button id="x" onclick="idbApp.deleteTask(${
          obj.id
        },this)">X</button>
        </span>
    <hr>
    </div>`;
  }

  addbtn.addEventListener("click", function (event) {
    event.preventDefault();
    const id = Date.now();
    let newTask = {
      id: id,
      taskTitle: ttl.value || "title",
      day: day.value || defaultDay,
      month: month.value || defaultMonth,
      year: year.value || defaultYear,
      hr: hr.value || defaultHour,
      min: min.value || defaultMinute,
      notified: false,
    };

    dateObject = new Date(
      `${newTask.hr}:${newTask.min} ${newTask.day} ${newTask.month} ${newTask.year}`
    );
    console.log(newTask);
    tasksDisplay(newTask);
    idbApp.addTasks(newTask);

    console.log(dateObject.getTime());
    console.log(dateObject.getTime() - new Date().getTime());

    setTimeout(() => {
      displayNotification(newTask);
      const doneTask = document.querySelector(`[id="${newTask.id}"]`);
      doneTask.style.textDecoration = "line-through";
      idbApp.updateTask(newTask);
    }, dateObject.getTime() - new Date().getTime());
  });
});

function displayNotification(task) {
  // TODO 2.3 - display a Notification
  if (Notification.permission == "granted") {
    navigator.serviceWorker.getRegistration().then((reg) => {
      console.log("service worker: ", reg);

      console.log(dateObject.getTime());
      // Format currentDate to match the format of dateObject

      const options = {
        body: task.taskTitle,
        // icon: '../images/notification-flat.png',
        data: {
          //dateOfArrival: dateObject,
          // primaryKey: task.id
        },
        //timestamp: Date.now() + 10000
        // actions: [
        //     { action: 'explore', title: 'Go to the site', icon: '../images/checkmark.png' },
        //     { action: 'close', title: 'close the notification', icon: '../images/xmark.png' }
        // ]
      };

      reg.showNotification("New Task Added!", options);
    });
  }
}

notifyButton.addEventListener("click", () => {
  Notification.requestPermission((status) => {
    console.log("Notification Permission ", status);
    if (status === "granted") {
      notifyButton.parentElement.style.display = "none";
    }
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // console.log('Service Worker and Push is supported');

    navigator.serviceWorker
      .register("sw.js")
      .then((swReg) => {
        console.log("Service Worker is registered", swReg);

        //swRegistration = swReg;

        // TODO 3.3a - call the initializeUI() function
      })
      .catch((err) => {
        console.error("Service Worker Error", err);
      });
  });
} else {
  console.warn("Push messaging is not supported");
  pushButton.textContent = "Push Not Supported";
}

if (Notification.permission === "granted") {
  notifyButton.parentElement.style.display = "none";
}
