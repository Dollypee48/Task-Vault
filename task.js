const taskInput = document.getElementById("task-input");
const addTask = document.getElementById("add-task");
const exportTask = document.getElementById("export-task");
const lightMode = document.getElementById("light-mode");
const taskList = document.getElementById("task-list");

document.addEventListener("DOMContentLoaded", loadTasks);

addTask.addEventListener("click", function() {
    let taskText = taskInput.value.trim(); 
    if (taskText !== "") {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
   
        let newTask = {
            text: taskText, 
            timeStamp: new Date().toISOString(), 
        };

        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTask();
        taskInput.value = "";
    }
});

function loadTasks() {
    displayTask();
}

function displayTask() {
    taskList.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(task => {
        if (task.completed === undefined) {
            task.completed = false;  
        }
    });

    tasks.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

    tasks.forEach(addTaskToList);
}

function addTaskToList(task) {
    let li = document.createElement("li");

    if (task.completed) {
        li.style.color = "green";
    }

    li.innerHTML = `
        <strong> ${task.text}</strong> <br> 
        <small> ${formatDate(task.timeStamp)}</small>
    `;

    let completeTaskButton = document.createElement("button");
    completeTaskButton.innerHTML = "✔️";
    completeTaskButton.addEventListener("click", function() {
        completeTask(task.text);
    });

    let deleteTaskButton = document.createElement("button");
    deleteTaskButton.innerHTML = "❌";
    deleteTaskButton.addEventListener("click", function() {
        deleteTask(task.text); 
    });

    li.appendChild(completeTaskButton);
    li.appendChild(deleteTaskButton);
    taskList.appendChild(li);
}

function deleteTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.filter((task) => task.text !== taskText);

    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTask();
}

function completeTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map((task) => {
        if (task.text === taskText) {
            task.completed = true;  
        }
        return task;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTask();
}

exportTask.addEventListener("click", function() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let strjson = JSON.stringify(tasks, null, 2);
    let blob = new Blob([strjson], {type: "application/json"});
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

function formatDate(timeStamp) {
    let date = new Date(timeStamp);
    return date.toLocaleString();
}

lightMode.addEventListener("click", function() {
    document.body.classList.toggle("light-mode");
});