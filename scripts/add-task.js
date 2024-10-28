let categoryInput;
let currentCategory;
let selectedContacts = [];
let currentSubtasks = [];
let subtaskArray = [];
let isDropdownOpen = false;
let userAsContact;

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
}

/**
 * Toggles the task priority based on the input.
 *
 * @param {string} prioInput - The new priority value to set (e.g., "urgent", "medium", "low").
 *
 * If the provided `prioInput` matches the current priority, it resets the priority to `null`.
 * Otherwise, it updates the priority to the new input and update the button color.
 */
function addPrio(prioInput) {
    if (prioInput == prio) {
        prio = null;
    } else {
        prio = prioInput;
    }
    updateBtnColor(prio);
}

/**
 * Updates the appearance of priority buttons and icons based on the selected priority.
 *
 * @param {string|null} prioValue - The current priority value ("urgent", "medium", "low") or `null` if no priority is set.
 *
 * This function resets all priority buttons and icons to their default state.
 * If a valid `prioValue` is provided, it updates the corresponding button and icon to indicate the active priority.
 */
function updateBtnColor(prioValue) {
    let prios = ["urgent", "medium", "low"];
    prios.forEach((p) => {
        document.getElementById(`${p}-btn`).classList.remove(p);
        document.getElementById(`prio-icon-${p}`).src = `./assets/icons/prio-${p}-icon.png`;
    });

    if (prioValue) {
        document.getElementById(`prio-icon-${prioValue}`).src = `./assets/icons/prio-${prioValue}-icon-active.png`;
        document.getElementById(`${prioValue}-btn`).classList.add(prioValue);
    }
}

/**
 * Toggles the visibility of a dropdown menu and updates the associated icon.
 *
 * @param {string} id - The ID of the dropdown element to toggle.
 * @param {string} iconId - The ID of the icon element to rotate based on dropdown state.
 *
 * This function adds or removes the "show-dropdown" class to the specified dropdown element,
 * indicating whether it is open or closed. It also rotates the icon: 180 degrees when closed
 * and back to its original position when open. If the dropdown is closed, it calls
 * `classChangeAction` to remove the "input-active" class.
 */
function toggleDropdown(id, iconId) {
    const dropdown = document.getElementById(id);
    const dropdownIcon = document.getElementById(iconId);
    dropdown.classList.toggle("show-dropdown");
    isDropdownOpen = dropdown.classList.contains("show-dropdown");
    if (!isDropdownOpen) {
        dropdownIcon.style.transform = "rotate(180deg)";
    } else {
        dropdownIcon.style.transform = "rotate(0deg)";
        classChangeAction("dropdown", "input-active", "remove");
    }
}

/**
 * Opens a dropdown menu and updates the associated icon.
 *
 * @param {string} id - The ID of the dropdown element to open.
 * @param {string} iconId - The ID of the icon element to rotate.
 *
 * This function adds the "show-dropdown" class to the specified dropdown, making it visible.
 * It rotates the icon to indicate that the dropdown is open and sets the global
 * `isDropdownOpen` variable to `true`. Finally, it calls `classChangeAction` to add
 * the "input-active" class.
 */
function openDropdown(id, iconId) {
    const dropdown = document.getElementById(id);
    const dropdownIcon = document.getElementById(iconId);
    dropdown.classList.add("show-dropdown");
    dropdownIcon.style.transform = "rotate(180deg)";
    isDropdownOpen = true;
    classChangeAction("dropdown", "input-active", "add");
}

/**
 * Closes the dropdown menu and resets the associated icon.
 *
 * This function removes the "show-dropdown" class from the dropdown, making it hidden.
 * It resets the icon's rotation to its original position and sets the global
 * `isDropdownOpen` variable to `false`. Additionally, it resets the input text
 * and calls `classChangeAction` to remove the "input-active" class.
 */
function closeDropdown() {
    const dropdown = document.getElementById("assign-to-dropdown-contacts");
    const dropdownIcon = document.getElementById("drop-down-icon1");
    dropdown.classList.remove("show-dropdown");
    dropdownIcon.style.transform = "rotate(0deg)";
    isDropdownOpen = false;
    resetInputText();
    classChangeAction("dropdown", "input-active", "remove");
}

/**
 * Handles the click on the Assigned to Input.
 *
 * @param {Event} event - The click event object.
 *
 * This function clears the input field when clicked, opens the dropdown menu for
 * assigning contacts, stops the event from bubbling up to parent elements,
 * and filters the dropdown options based on the input.
 */
function handleInputClick(event) {
    document.getElementById("assign-to-dropdown").value = "";
    openDropdown("assign-to-dropdown-contacts", "drop-down-icon1");
    stopEventBubbling(event);
    filter("assign-to-dropdown");
}

/**
 * Handles the click event on the dropdown button.
 *
 * @param {Event} event - The click event object.
 *
 * This function stops the event from bubbling up, toggles the visibility of the dropdown menu,
 * and updates the icon's rotation.
 * If the dropdown is closed, it resets the input text and
 * removes the "input-active" class.
 * If the dropdown is open, it clears the dropdown's value, rotates the icon to indicate it is open, adds the "input-active" class, and filters the
 * dropdown options based on the input.
 */
function handleDropdownButtonClick(event) {
    stopEventBubbling(event);
    toggleDropdown("assign-to-dropdown-contacts", "drop-down-icon1");
    const dropdownIcon = document.getElementById("drop-down-icon1");

    if (!isDropdownOpen) {
        resetInputText();
        classChangeAction("dropdown", "input-active", "remove");
        dropdownIcon.style.transform = "rotate(0deg)";
    } else {
        document.getElementById("assign-to-dropdown").value = "";
        dropdownIcon.style.transform = "rotate(180deg)";
        classChangeAction("dropdown", "input-active", "add");
        filter("assign-to-dropdown");
    }
}

/**
 * Resets the text of the input field to default message.
 */
function resetInputText() {
    let inputRef = document.getElementById("assign-to-dropdown");
    inputRef.value = "Select contacts to assign";
}

/**
 * Retrieves and prepares the list of selected contacts.
 *
 * This function iterates over the global `contacts` array and creates an array of
 * selected contacts. Each selected contact includes its name, color, a checked
 * status set to `false`, and an index ID.
 */
function getSelectedContacts() {
    contacts.forEach((contact, i) => {
        selectedContacts.push({
            name: contact.name,
            color: contact.color,
            checked: false,
            id: i,
            key: contact.key,
        });
    });
}

/**
 * Adds the current user as a contact to the contacts list.
 *
 * This function adds the user as a contact to the global contacts array.
 * The user's name and color are taken from the `userAsContact` object.
 */
function userInContatcs() {
    if (user !== "Guest") {
        contacts.push({
            name: userAsContact.name,
            color: userAsContact.color,
        });
    } else return;
}

/**
 * Renders the list of contacts in the dropdown menu.
 *
 * @param {Array} arr - An array of contact objects to display.
 *
 * This function clears the current content of the dropdown with the ID
 * "assign-to-dropdown-contacts" and populates it with HTML generated for each
 * contact in the provided array. It uses the `contactInDropDownHTML` function
 * to create the HTML for each contact and updates the design by calling
 * `updateDesign` for each contact's ID.
 */
async function renderContacts(arr) {
    let dropDownRef = document.getElementById("assign-to-dropdown-contacts");
    let userName = localStorage.getItem("user");
    dropDownRef.innerHTML = "";
    arr.forEach((contact) => {
        dropDownRef.innerHTML += contactInDropDownHTML(contact, createInititals(contact.name));
        updateDesign(contact.id);
    });

    if (userName == "Guest") {
        return;
    }
}

/**
 * Updates the design of a contact based on its selection status.
 *
 * @param {number} id - The ID of the contact to update.
 *
 * This function modifies the appearance of the contact container and its checkbox
 * based on whether the contact is selected (checked) or not. If the contact is selected,
 * it adds the "contact-active" class to the contact container and marks the checkbox as checked.
 * If the contact is not selected, it removes the "contact-active" class and unchecks the checkbox.
 */
function updateDesign(id) {
    let contactContainerRef = document.getElementById("contact" + id);
    let checkboxRef = document.getElementById("checkbox" + id);
    if (selectedContacts[id].checked) {
        contactContainerRef.classList.add("contact-active");
        checkboxRef.setAttribute("checked", true);
    } else if (!selectedContacts[id].checked) {
        contactContainerRef.classList.remove("contact-active");
        checkboxRef.removeAttribute("checked");
    }
}

/**
 * Toggles the selection status of a contact and updates the UI.
 *
 * @param {number} id - The ID of the contact to select or deselect.
 *
 * This function retrieves the contact from the `selectedContacts` array based on the
 * provided ID, toggles its `checked` status, and updates the design of the contact
 * using `updateDesign`. Finally, it calls `renderSelectedContacts` to refresh the
 * display of selected contacts.
 */
function selectContact(id) {
    let currentContact = selectedContacts[id];
    currentContact.checked = !currentContact.checked;
    updateDesign(id);
    renderSelectedContacts();
}

/**
 * Renders the list of selected contacts in the designated container.
 *
 * This function clears the current content of the "selected-contacts-container"
 * and populates it with HTML for each selected contact. It filters the `selectedContacts`
 * array to find contacts that are checked (selected) and then generates the corresponding
 * HTML for each using the `contactSelectionCircleHTML` function, along with the initials
 * of each contact's name.
 */
function renderSelectedContacts() {
    const containerRef = document.getElementById("selected-contacts-container");
    containerRef.innerHTML = "";
    let assignedToContacts = selectedContacts.filter((c) => c.checked == true);

    for (let contact of assignedToContacts) {
        containerRef.innerHTML += contactSelectionCircleHTML(contact);
    }
}

/**
 * Filters and displays contacts based on the input value.
 *
 * @param {string} id - The ID of the input element used for filtering.
 *
 * This function retrieves the value from the specified input element, converts it
 * to lowercase, and checks if the input length is greater than 2. If so, it searches
 * for matching contacts using the `findInput` function. If no contacts are found,
 * it displays a "no contact found" message. If matches are found, it renders those
 * contacts using `renderContacts`. If the input length is 2 or less, it renders
 * all selected contacts.
 */
function filter(id) {
    const inputRef = document.getElementById(id);
    const input = inputRef.value.toLowerCase();
    if (input.length > 2) {
        const result = findInput(input);
        if (result.length === 0) {
            displayNoContactFoundMessage();
        } else {
            renderContacts(result);
        }
    } else {
        renderContacts(selectedContacts);
    }
}

/**
 * Displays a message indicating that no contacts were found.
 *
 * This function updates the content of the dropdown with the ID
 * "assign-to-dropdown-contacts" to show a message ">No Contact found"
 * when no contacts match the search criteria.
 */
function displayNoContactFoundMessage() {
    const dropdownRef = document.getElementById("assign-to-dropdown-contacts");
    dropdownRef.innerHTML = '<li class="not-found">No Contact found</li>';
}

/**
 * Finds contacts that match the given input.
 *
 * @param {string} input - The input string to search for in contact names.
 * @returns {Array} An array of contacts whose names include the input string (case-insensitive).
 *
 * This function filters the `selectedContacts` array, returning an array of contacts
 * whose names contain the specified input string, ignoring case.
 */
function findInput(input) {
    let result = selectedContacts.filter((contact) => contact.name.toLowerCase().includes(input));
    return result;
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
 * Filters the selected contacts to return only those that are checked (selected).
 *
 * @returns {Array} An array of contacts that are marked as checked.
 *
 * This function iterates over the `selectedContacts` array and filters it to
 * create a new array containing only the contacts that have their `checked`
 * property set to `true`.
 */
function filterCheckedAssignedTo() {
    let filtertContacts = selectedContacts.filter((contact) => contact.checked == true);
    return filtertContacts;
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
 * Returns today's date in the format YYYY-MM-DD.
 *
 * This function creates a Date object for the current date
 * and formats it in ISO format (year-month-day), which is suitable for 
 * the `min` attribute in <input type="date"> fields.
 *
 * @returns {string} Today's date in the format "YYYY-MM-DD".
 */
function currentDate() {
    const date = new Date();
    let currentDay = String(date.getDate()).padStart(2, '0');
    let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
    let currentYear = date.getFullYear();
    let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

    return currentDate;
}

/**
 * Sets the minimum selectable date for the date input field to today's date.
 * 
 * This code executes after the DOM is fully loaded to ensure that the `#date`
 * input field is present in the document before setting its `min` attribute.
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#date').min = currentDate();
});