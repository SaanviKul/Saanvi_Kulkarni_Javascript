// Retrieve saved tasks from localStorage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Variables to track selected date and current month/year for the calendar
let selectedDate = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
// Array of month names for display
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Save tasks to localStorage to persist data across page reloads
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Filter tasks based on their status (all, completed, or pending)
function filterTasks(status) {
    renderTasks(status);  //// Call renderTasks with the selected filter
}   

function renderTasks(filter = 'all') {
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = '';  

    // Apply filtering based on task status
    let filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
    });

    filteredTasks.forEach(task => {
        let li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.className = task.completed ? 'completed' : '';

        li.innerHTML = `
            <span>${task.name}: ${task.description}</span>
            <div>
                <button onclick="toggleTaskStatus(${task.id})">Completed</button>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function renderTasks(filter = 'all') {
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
    });

    if (selectedDate) {
        filteredTasks = filteredTasks.filter(task => task.date === selectedDate);  // Only show tasks for selected date
    }

    filteredTasks.forEach(task => {
        let li = document.createElement('li');  // Assign CSS class based on completion status
        li.setAttribute('data-id', task.id);
        li.className = task.completed ? 'completed' : '';

        li.innerHTML = `
            <span>${task.name}: ${task.description}</span>
            <div>
                <button onclick="toggleTaskStatus(${task.id})">Completed</button>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        taskList.appendChild(li);  // Append task to task list
    });
}

function addTask() {
    let name = document.getElementById('taskName').value.trim();
    let description = document.getElementById('taskDesc').value.trim();

    if (!selectedDate) {
        alert("❌ Please select a date before adding a task!");  // Ensure date selected before adding task
        return;
    }

    if (!name) {
        alert("❌ Task name cannot be empty!");  // Ensure task name is provided / added
        return;
    }

    let newTask = {  // Create a new task object
        id: Date.now(),
        name,
        description,
        date: selectedDate,
        completed: false
    };

    tasks.push(newTask);  // append the new task in the task list
    saveTasks();
    renderTasks();

    document.getElementById('taskName').value = '';  // Save and render 
    document.getElementById('taskDesc').value = '';  // clears the task input field
}

function toggleTaskStatus(id) {
    let task = tasks.find(task => task.id === id);  // Find the task by ID =  completed 
    if (task) {
        task.completed = !task.completed;   // Toggle completion and update UI
        saveTasks();
        renderTasks();
    }
}

function editTask(id) {
    let task = tasks.find(task => task.id === id);  // Find the task bu ID = edit
    if (!task) return;

    let taskElement = document.querySelector(`[data-id='${id}']`);
    if (!taskElement) return;

    // Create input fields for editing task name and description
    let nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = task.name;

    let descInput = document.createElement('input');
    descInput.type = 'text';
    descInput.value = task.description;

    // Create save button to update task details
    let saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = function () {
        task.name = nameInput.value.trim();
        task.description = descInput.value.trim();
        saveTasks();
        renderTasks();
    };

    // Replace task element with input fields and save button
    taskElement.innerHTML = '';
    taskElement.appendChild(nameInput);
    taskElement.appendChild(descInput);
    taskElement.appendChild(saveButton);
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);  // Remove task from array and update list
    saveTasks();
    renderTasks();
}

function prevMonth() {
    currentMonth--;  // Move to previous month and update calendar
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar();
}

function nextMonth() {
    currentMonth++;  // Move to next month and update calendar
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar();
}

function generateCalendar() {
    const calendar = document.getElementById('calendar');
    const monthYear = document.getElementById('month-year');
    calendar.innerHTML = '';
    monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;  // Display current month and year

    let firstDay = new Date(currentYear, currentMonth, 1).getDay();  // Get the first day of the month
    let lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();  // Get total days in month

    for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(document.createElement('div'));  // Add empty slots for first week alignment
    }

    for (let day = 1; day <= lastDate; day++) {
        let dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;  // Create day cell

        dayDiv.onclick = function () {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));  // Remove previous selection
            dayDiv.classList.add('selected');
            selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;  // Store selected date
            renderTasks();  // Update tasks for selected date
        };

        calendar.appendChild(dayDiv);  // Add day to calendar grid
    }
}
 // Initialize calendar and task list on page load
generateCalendar();
renderTasks();
