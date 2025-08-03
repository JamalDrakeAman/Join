/**
 * Initializes the task creation process by setting up the necessary data and UI elements.
 *
 * This function clears the selected contacts array, updates the priority button color,
 * fetches the contacts from the server, adds the current user as a contact,
 * prepares the selected contacts for display, and renders the contact list in the dropdown.
 */
async function addTaskInit() {
    selectedContacts = [];
    updateBtnColor(prio);
    await getContacts();
    userAsContact = await getOwnContact();
    userInContatcs();
    getSelectedContacts();
    renderContacts(selectedContacts);
    initUploader(document.querySelector('#add-task'), false);
}


/**
 * Creates a new task and updates the user interface accordingly.
 *
 * This asynchronous function retrieves the current category, posts the new task
 * using the `postTask` function, shows a success message, and clears the task
 * input fields with the `clearAddTask` function.
 */
async function createTask() {
    getCurrentCategory();
    if (!addTaskValidation()) {
        return
    }
    await postTask();
    showSuccesMsg();
    clearAddTask();
}

/**
 * Clears the task input fields and resets related UI elements.
 *
 * This function resets the values of the title, description, and date input fields
 * to empty strings, clears the inner HTML of the subtasks and selected contacts
 * containers, and resets the priority to "medium". It also clears the current subtasks
 * array, unchecks all selected contacts, updates the button color to reflect the reset
 * priority, and removes the active overlay class from the add task overlay.
 */
function clearAddTask() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("date").value = "";
    document.getElementById("subtasks-container").innerHTML = "";
    document.getElementById("selected-contacts-container").innerHTML = "";
    prio = "medium";
    currentSubtasks = [];
    selectedContacts.forEach((c) => {
        c.checked = false;
    });
    updateBtnColor(prio);
    classChangeAction("add-task-overlay", "overlaver-active", "remove");
    deleteImages()
}


/**
 * Displays a success message after a task is created and manages
 * the visibility of overlays.
 *
 * This function adds an active overlay class to the success message element,
 * then sets a timeout to remove it after 2 seconds. After removing the
 * success message, it sets another timeout for an additional 500 milliseconds
 * to remove the add task overlay. If the current page is not the board page,
 * it redirects the user to "board.html".
 */
function showSuccesMsg() {
    classChangeAction("add-task-succes-msg", "overlaver-active", "add");
    setTimeout(function () {
        classChangeAction("add-task-succes-msg", "overlaver-active", "remove");
        setTimeout(function () {
            classChangeAction("add-task-overlay", "overlaver-active", "remove");
            if (!document.getElementById("board-link").classList.contains("activePage")) {
                window.location.href = "board.html";
            } else resetBoard();
        }, 500);
    }, 2000);
}


/**
 * Saves the selected task category to local storage.
 *
 * @param {string} categoryValue - The category value to be saved e.g "To-Do" or "Await feedback".
 *
 * This function calls `saveToLocalStorage` to store the specified category value
 * under the key "taskCategory" in the browser's local storage.
 */
function setTaskCategory(categoryValue) {
    saveToLocalStorage("taskCategory", categoryValue);
}


/**
 * Retrieves the current task category from local storage.
 *
 * This function updates the global variable `currentCategory` by
 * retrieving the value stored under the key "taskCategory" from
 * the browser's local storage.
 */
function getCurrentCategory() {
    currentCategory = getFromLocalStorage("taskCategory");
}