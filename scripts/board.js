let currentDraggedElement;
let tasksArray = [];
let currentTask;
let taskCounter = 0;

/**
 * Initializes the board by fetching the necessary data and updating the UI.
 *
 * This function retrieves the list of contacts, prepares the selected contacts,
 * fetches tasks, updates the HTML to display the tasks,
 * and finally adds the current user as a contact.
 */
async function boardInit() {
    await getContacts();
    getSelectedContacts();
    await getTasks();
    updateHtml();
    userAsContact = await getOwnContact();
    userInContatcs();
}

/**
 * Resets the board by fetching updated tasks and refreshing the HTML.
 */
async function resetBoard() {
    await getTasks();
    updateHtml();
}

/**
 * Updates the HTML by rendering tasks into their respective columns
 */
function updateHtml() {
    let todoById = document.getElementById("to-do-container");
    let progressById = document.getElementById("in-progress-container");
    let feedbackById = document.getElementById("await-feedback-container");
    let doneById = document.getElementById("done-container");
    renderTasks(filterTasks("todo"), todoById, "To do");
    renderTasks(filterTasks("progress"), progressById, "Progress");
    renderTasks(filterTasks("feedback"), feedbackById, "Feedback");
    renderTasks(filterTasks("done"), doneById, "Done");
}

/**
 * Filters tasks based on their category.
 * @param {string} category - The category to filter tasks by (e.g., "todo", "progress").
 * @returns {Array} - The array of tasks that match the given category.
 */
function filterTasks(category) {
    return tasksArray.filter((task) => task.category === category);
}

/**
 * Renders tasks into the provided HTML container.
 * @param {Array} tasks - Array of tasks to be rendered.
 * @param {HTMLElement} getById - The HTML container element where the tasks will be rendered.
 * @param {string} noTask - The message to display when there are no tasks.
 */
function renderTasks(tasks, getById, noTask) {
    getById.innerHTML = "";
    if (tasks.length == 0) {
        getById.innerHTML += generateNoTaskHTML(noTask);
    } else {
        for (let index = 0; index < tasks.length; index++) {
            taskCounter++;
            let task = tasks[index];
            let className = task.categoryText.replace(" ", "-").toLowerCase();
            getById.innerHTML += generateTaskHTML(task, index, className);
            renderNoRequiredDetails(task, index);
        }
    }
}

/**
 * Renders optional details for a task such as assigned contacts, subtasks, and priority.
 * @param {Object} task - The task object containing details.
 * @param {number} index - The index of the task in the list.
 */
function renderNoRequiredDetails(task, index) {
    if (task.assignedTo) {
        renderAssignedToContacts(task, index);
    }
    if (task.subtask) {
        renderSubtaskBar(task, index);
    }
    if (task.prio) {
        renderPrio(task, index);
    }
}

/**
 * Calculates and renders the progress of a task based on its subtasks.
 * @param {Object} task - The task object containing subtasks.
 * @param {number} index - The index of the task in the list.
 */
function renderSubtaskBar(task, index) {
    let amount = task.subtask.filter((c) => c.checked == true).length;
    let total = task.subtask.length;
    let result = Math.round((100 / total) * amount) + "%";
    document.getElementById(`${task.category}-amount${index}`).innerHTML = `${amount}/${total} Subtasks`;
    document.getElementById(`${task.category}progress-bar${index}`).classList.remove("d-none");
    document.getElementById(`${task.category}-progress${index}`).style.width = result;
}

/**
 * Renders up to three assigned contacts for a task, and shows the number of additional contacts if any.
 * @param {Object} task - The task object containing assigned contacts.
 * @param {number} index - The index of the task in the list.
 */
function renderAssignedToContacts(task, index) {
    const assignedToContainer = document.getElementById(`${task.category}contatcs-container${index}`);
    const numContainer = document.getElementById(`${task.category}contatcs-container${index}num`);
    task.assignedTo.forEach((c, i) => {
        if (i < 3) {
            assignedToContainer.innerHTML += `
        <div class="c${i} contact center" style="background-color:${c.color}">${createInititals(c.name)}</div>`;
        } else {
            numContainer.innerHTML = `<div class="task-contact-length center">+${i - 2}</div>`;
        }
    });
}

/**
 * Renders the priority icon for a task based on its priority level.
 *
 * @param {Object} task - The task object containing task details.
 * @param {number} index - The index of the task, used to uniquely identify the priority icon.
 */
function renderPrio(task, index) {
    const imgRef = document.getElementById(`${task.category}prio-icon${index}`);
    if (task.prio) {
        imgRef.src = `./assets/icons/prio-${task.prio}-icon.png`;
        imgRef.classList.remove("d-none");
    }
}

/**
 * Moves the currently dragged task to a specified category.
 * Updates the task in the array and refreshes the database and HTML accordingly.
 *
 * @param {string} category - The target category to move the task to.
 */
function moveTo(category) {
    tasksArray[currentDraggedElement]["category"] = category;
    moveToUpdateDatabase();
    updateHtml();
}

/**
 * Initiates the dragging operation by setting the currently dragged element.
 *
 * @param {number} id - The ID of the element being dragged.
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * Allows an element to be dropped by preventing the default behavior of the event.
 *
 * @param {DragEvent} ev - The drag event object.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Highlights a drag area by adding a specific CSS class.
 *
 * @param {string} id - The ID of the HTML element to highlight.
 */
function highlight(id) {
    document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * Removes the highlight from a drag area by removing a specific CSS class.
 *
 * @param {string} id - The ID of the HTML element to remove the highlight from.
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove("drag-area-highlight");
}

/**
 * Adds a dragging animation to a specific element.
 *
 * @param {string} id - The ID of the HTML element to animate.
 */
function animationOndrag(id) {
    document.getElementById(id).classList.add("animation-ondrag");
}

/**
 * Opens a task, displays its overlay, and triggers related functions.
 *
 * @param {number} id - The ID of the task to open.
 */
function openTask(id) {
    currentTask = tasksArray[id];
    document.getElementById("overlaver").innerHTML = taskBoardOverlay(currentTask);
    taskPrioText();
    renderTasksArrays();
}

/**
 * Renders the list of assigned contacts and their subtasks for the current task.
 */
function renderTasksArrays() {
    let assignedToRef = document.getElementById("assigned-to-list");
    assignedToRef.innerHTML = "";
    if (currentTask.assignedTo) {
        currentTask.assignedTo.forEach((contact) => {
            assignedToRef.innerHTML += generateAssignedToOerlayLiHTML(contact);
        });
    }
    setCheck();
}

/**
 * Renders the checklist for subtasks within the task overlay.
 */
function setCheck() {
    let subtaskRef = document.getElementById("subtask-overlay");
    subtaskRef.innerHTML = "";
    if (currentTask.subtask) {
        currentTask.subtask.forEach((s, i) => {
            subtaskRef.innerHTML += `
    <div class="task-overlay-subtask" onclick="checkAndPushToFirebase(${i})"><img src="./assets/icons/${s.checked}.png" alt=""> ${s.sub}</div>
    `;
        });
    }
}

/**
 * Displays the editable values for the selected task.
 */
function showEditTaskValues() {
    document.getElementById("overlaver").innerHTML = editBoardTaskHTML(currentTask);
    editTaskAssignTo();
    editTaskSubtask();
    updateBtnColor(currentTask.prio);
    taskPrioText();
}

/**
 * Edits the task's assigned contacts.
 */
function editTaskAssignTo() {
    selectedContacts = []
    getSelectedContacts();
    if (currentTask.assignedTo) {
        findCheckedContacts(currentTask);
        renderContacts(selectedContacts);
        renderSelectedContacts();
    }
}

/**
 * Updates the priority text displayed in the task overlay.
 */
function taskPrioText() {
    if (currentTask.prio) {
        document.getElementById("prio").innerHTML = currentTask.prio.charAt(0).toUpperCase() + currentTask.prio.slice(1);
    } else {
        document.getElementById("prio").innerHTML = "No Prio";
    }
}

/**
 * Toggles the priority of the task.
 *
 * @param {string|null} prioInput - The new priority value.
 */
function editPrio(prioInput) {
    if (prioInput == currentTask.prio) {
        currentTask.prio = null;
    } else {
        currentTask.prio = prioInput;
    }
    updateBtnColor(currentTask.prio);
}

/**
 * Finds and marks contacts that are already assigned to the current task.
 *
 * @param {Object} currentTask - The task being edited.
 */
function findCheckedContacts(currentTask) {
    selectedContacts.forEach((selectedContact) => {
        currentTask.assignedTo.forEach((assignedContact) => {
            if (assignedContact.name === selectedContact.name) {
                selectedContact.checked = true;
            }
        });
    });
}

/**
 * Renders the subtasks for editing.
 */
function editTaskSubtask() {
    if (currentTask.subtask) {
        renderSubtaskEdit(currentTask.subtask);
        currentSubtasks = [];
        currentSubtasks.push(...currentTask.subtask);
    }
}

/**
 * Renders the subtask edit form.
 *
 * @param {Array} subtasks - Array of subtasks to render.
 */
function renderSubtaskEdit(subtasks) {
    let subTaskRef = document.getElementById("subtasks-container");
    subtasks.forEach((subtask, i) => {
        subTaskRef.innerHTML += subtaskTaskHTML(subtask, i);
    });
}

/**
 * Saves the edited value of a subtask.
 *
 * @param {number} index - The index of the subtask being edited.
 */
function saveWord(index) {
    const newValue = document.getElementById(`editInput${index}`).value;
    currentSubtasks[index].sub = newValue;
    renderSubtaskEdit(currentSubtasks);
}

/**
 * Deletes a subtask from the task.
 *
 * @param {number} i - The index of the subtask to delete.
 */
function deleteSubtask(i) {
    currentSubtasks.splice(i, 1);
    renderSubtaskEdit(currentSubtasks);
    classChangeAction("overlaver", "overlaver-active", "remove");
}

/**
 * Toggles the display of task move options.
 *
 * @param {number} taskId - The ID of the task.
 */
function openTaskMoveOptions(taskId) {
    document.getElementById(`task-move-list${taskId}`).classList.toggle("show-drop-list");
}

/**
 * Filters and renders tasks across different categories based on the search input.
 *
 * @param {string} screen - The current screen (used for search input identification).
 */
function filterBoardTasks(screen) {
    taskCounter = 0;
    let search = document.getElementById(`search-task-${screen}`).value;
    search = search.toLowerCase();
    let todoById = document.getElementById("to-do-container");
    let progressById = document.getElementById("in-progress-container");
    let feedbackById = document.getElementById("await-feedback-container");
    let doneById = document.getElementById("done-container");
    renderTasks(filterSearchTasks("todo", search), todoById, "To do");
    renderTasks(filterSearchTasks("progress", search), progressById, "Progress");
    renderTasks(filterSearchTasks("feedback", search), feedbackById, "Feedback");
    renderTasks(filterSearchTasks("done", search), doneById, "Done");
    foundTasks(screen);
}

/**
 * Displays the number of tasks found for a given screen.
 *
 * @param {string} screen - The screen identifier.
 */
function foundTasks(screen) {
    let numberOfTasksRef = document.getElementById(`nummber-of-${screen}`);
    if (taskCounter == 0) {
        numberOfTasksRef.innerHTML = `No task found`;
    } else if (taskCounter == 1) {
        numberOfTasksRef.innerHTML = `${taskCounter} found task`;
    } else {
        numberOfTasksRef.innerHTML = `${taskCounter} found tasks`;
    }
}

/**
 * Filters tasks based on a search query.
 *
 * @param {string} task - The category to filter by.
 * @param {string} search - The search query.
 */
function filterSearchTasks(task, search) {
    let filterArray = tasksArray.filter((t) => t["category"] == task);
    let filterTasks = [];
    for (let i = 0; i < filterArray.length; i++) {
        let tasks = filterArray[i];
        if (tasks.title.toLowerCase().includes(search) || tasks.description.toLowerCase().includes(search)) {
            filterTasks.push(tasks);
        }
    }
    return filterTasks;
}

/**
 * Automatically scrolls to a section of the page when loaded, based on the URL hash.
 */
window.addEventListener("load", function () {
    let section = window.location.hash.substring(1);
    section = section.slice(1);
    if (section) {
        setTimeout(function () {
            scrollToSection(section);
        }, 100);
    }
});

/**
 * Smoothly scrolls to a specified section of the page.
 *
 * @param {string} section - The section ID to scroll to.
 */
function scrollToSection(section) {
    let sectionColumn = document.getElementById(section);
    if (sectionColumn) {
        sectionColumn.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
        });
    }
}

