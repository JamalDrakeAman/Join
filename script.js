let user = localStorage.getItem("user");
let userId = localStorage.getItem("userId");
let contacts = [];
let prio = "medium";
let screenMode;

/**
 * Logs the user out by clearing relevant user data from localStorage
 * and redirecting to the login page (index.html).
 *
 * - Clears `user`, `userId`, `rememberMeUser`, and `rememberMe` from localStorage.
 * - Redirects to the index.html page.
 */
function logOut() {
    localStorage.setItem("user", "");
    localStorage.setItem("userId", "");
    window.location.href = "index.html";
    localStorage.removeItem("rememberMeUser");
    localStorage.removeItem("rememberMe");
}

/**
 * Retrieves the contact information for the current user from the database.
 *
 * This function makes an asynchronous request to fetch the user data
 * from a specific path based on the user's ID.
 *
 * @async
 * @function getOwnContact
 * @returns {Promise<Object>} A promise that resolves to the contact information of the user.
 *                            The object contains user data such as name, email, color, phone.
 */
async function getOwnContact() {
    let ownContactResponse = await getData((path = `users/${userId}`));
    return ownContactResponse;
}

/**
 * Formats and returns the essential contact information of the current user.
 *
 * This function calls `getOwnContact` to retrieve the user's data, then extracts
 * key information such as color, email, name, and phone into a simplified object.
 *
 * @async
 * @function ownContact
 * @returns {Promise<Object>} A promise that resolves to an object containing
 *                            the user's color, email, name, and phone.
 */
async function ownContact() {
    let ownContactData = await getOwnContact();
    return {
        color: ownContactData.color,
        email: ownContactData.email,
        name: ownContactData.name,
        phone: ownContactData.phone,
    };
}

/**
 * Marks a specific page element by adding an active style class.
 *
 * This function finds an HTML element by its ID and adds a specified CSS class
 * to visually mark it as active.
 *
 * @function markedPage
 * @param {string} id - The ID of the HTML element to mark as active.
 * @param {string} activeStyle - The CSS class that will be added to the element to apply the active style.
 */
function markedPage(id, activeStyle) {
    document.getElementById(id).classList.add(activeStyle);
}

/**
 * Creates initials from a given name.
 *
 * Depending on the number of words in the input name, this function will return initials:
 * - If there is one word, the first letter of that word is returned.
 * - If there are two words, the first letter of each word is returned.
 * - If there are three or more words, the first letter of the first and third words is returned.
 *
 * @function createInititals
 * @param {string} selectName - The full name from which to extract initials.
 * @returns {string} The initials derived from the name, or an empty string if the name is invalid.
 */
function createInititals(selectName) {
    if (selectName === undefined || selectName === null) {
        return "";
    }
    let parts = selectName.split(" ");
    if (parts.length === 1) {
        let neededPartOne = parts[0].slice(0, 1);
        return neededPartOne;
    } else if (parts.length === 2) {
        let neededPartOne = parts[0].slice(0, 1);
        let neededPartTwo = parts[1].slice(0, 1);
        return neededPartOne + neededPartTwo;
    } else if (parts.length >= 3) {
        let neededPartOne = parts[0].slice(0, 1);
        let neededPartThree = parts[2].slice(0, 1);
        return neededPartOne + neededPartThree;
    }
}

/**
 * Generates a random hex color code.
 *
 * This function creates a random number between 0 and 16777215 (which is the maximum value for 24-bit colors),
 * converts it to a hexadecimal string, and returns the corresponding hex color code.
 *
 * @function randomColor
 * @returns {string} The generated random hex color code, prefixed with '#'.
 */
function randomColor() {
    let random = Math.floor(Math.random() * 16777215).toString(16);
    let hexCode = "#" + random;
    return hexCode;
}

/**
 * Sorts an array of objects alphabetically by the 'name' property.
 *
 * This function uses the `localeCompare` method to sort the objects in the array
 * based on the value of their `name` property in alphabetical order.
 *
 * @function sortByAlphabet
 * @param {Object[]} arr - The array of objects to be sorted.
 * @param {string} arr[].name - The 'name' property of each object.
 * @returns {Object[]} The sorted array of objects by their 'name' property.
 */
function sortByAlphabet(arr) {
    arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
}

/**
 * Saves a value to the browser's local storage.
 *
 * The value is first converted to a JSON string using `JSON.stringify`
 * before being stored under the specified key.
 *
 * @function saveToLocalStorage
 * @param {string} key - The key under which the value will be stored in local storage.
 * @param {*} value - The value to be stored in local storage. It can be of any type,
 *                    as it will be serialized into a JSON string.
 */
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieves a value from the browser's local storage.
 *
 * The value is parsed from a JSON string back to its original form
 * (e.g., array, object, string, etc.) using `JSON.parse`.
 *
 * @function getFromLocalStorage
 * @param {string} key - The key under which the value is stored in local storage.
 * @returns {*} The value retrieved from local storage, or `undefined` if no value is found.
 */
function getFromLocalStorage(key) {
    let myData;
    let myArr = JSON.parse(localStorage.getItem(key));
    if (myArr !== null) {
        myData = myArr;
    }
    return myData;
}

/**
 * Clears the value of the specified input element.
 *
 * This function sets the value of the input field to an empty string,
 * effectively clearing any text that was previously entered by the user.
 *
 * @function clearInput
 * @param {HTMLInputElement} input - The input element to be cleared.
 */
function clearInput(input) {
    input.value = "";
}

/**
 * Stops the propagation of an event in the DOM.
 *
 * This function prevents the event from bubbling up to parent elements,
 * ensuring that the event handler on the current element is the last one
 * to handle the event.
 *
 * @function stopEventBubbling
 * @param {Event} event - The event object to stop propagation for.
 */
function stopEventBubbling(event) {
    event.stopPropagation();
}

/**
 * Retrieves contacts from a remote data source and stores them in a local array.
 *
 * This function fetches contact data using the `getData` function, processes it,
 * and sorts the contacts alphabetically. The sorted contacts are stored in the
 * global `contacts` array.
 *
 * @async
 * @function getContacts
 * @returns {Promise<void>} A promise that resolves when the contacts have been fetched
 *                          and sorted. This function does not return any value.
 */
async function getContacts() {
    contacts = [];
    const contactsData = await getData("contacts");
    const keys = Object.keys(contactsData);
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        const contact = contactsData[key];
        contacts.push({
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            color: contact.color,
            key: key,
        });
    }
    sortByAlphabet(contacts);
}

/**
 * Changes the CSS class of a specified HTML element based on the provided action.
 *
 * This function adds, removes, or toggles a CSS class on an HTML element with the
 * given ID. The action to be performed can be specified as either "add", "remove",
 * or "toggle".
 *
 * @function classChangeAction
 * @param {string} id - The ID of the HTML element to modify.
 * @param {string} className - The name of the CSS class to be added, removed, or toggled.
 * @param {("add"|"remove"|"toggle")} action - The action to perform on the CSS class.
 *                                              Must be one of "add", "remove", or "toggle".
 * @returns {void} This function does not return a value.
 */
function classChangeAction(id, className, action) {
    const element = document.getElementById(id);
    if (element) {
        if (action === "toggle") {
            element.classList.toggle(className);
        } else if (action === "add") {
            element.classList.add(className);
        } else if (action === "remove") {
            element.classList.remove(className);
        }
    } else return;
}

/**
 * Checks the current screen width and updates the header and sidebar
 * content accordingly based on whether the screen is in mobile or desktop mode.
 *
 * This function determines the appropriate header and sidebar HTML based
 * on the current screen width. It updates the inner HTML of the header and
 * sidebar elements. Additionally, it sets a global variable `screenMode`
 * to indicate the current mode of the application.
 *
 * @function checkScreenWidth
 * @returns {void} This function does not return a value.
 */
function checkScreenWidth() {
    let header = document.getElementById("join-header");
    let sidebar = document.getElementById("join-sidebar");
    let currentHeader = "";
    let currentSidebar = "";
    try {
        if (window.innerWidth <= 1024) {        
            currentHeader = mobileHeader(createInititals(user));
            currentSidebar = mobileSidebar();
            screenMode = "mobile";
        } else {
            currentHeader = desktopHeader(createInititals(user));
            currentSidebar = desktopSidebar();
            screenMode = "desktop";
        }
        header.innerHTML = currentHeader;
        sidebar.innerHTML = currentSidebar;
    } catch {
    }
}

checkScreenWidth();
checkIsSomeoneLogedId();
window.addEventListener("resize", checkScreenWidth);
window.addEventListener("resize", checkIsSomeoneLogedId);

/**
 * Hides the help icon by setting its display style to "none".
 *
 * This function is called to hide the help icon in the user interface
 * when it is no longer needed or should not be visible.
 *
 * @function hideHelpIcon
 * @returns {void} This function does not return a value.
 */
function hideHelpIcon() {
    document.getElementById("help-icon").style.display = "none";
}

/**
 * Checks if a user is logged in and hides specific UI elements if not.
 *
 * This function verifies if the `user` variable is falsy (indicating
 * that no user is logged in). If no user is logged in, it adds the
 * "d-none" class to several elements in the user interface to hide
 * links related to the summary, task board, adding tasks, and contacts.
 *
 * @function checkIsSomeoneLogedId
 * @returns {void} This function does not return a value.
 */
function checkIsSomeoneLogedId() {
    if (!user) {
        let summaryRef = document.getElementById("summary-link");
        if (summaryRef) {
            document.getElementById("summary-link").classList.add("d-none");
            document.getElementById("board-link").classList.add("d-none");
            document.getElementById("add-task-link").classList.add("d-none");
            document.getElementById("contact-link").classList.add("d-none");
        }
    }
}

/**
 * Opens the add task interface based on the specified task category.
 *
 * This function sets the task category and navigates to the add task page
 * or toggles the visibility of the add task overlay depending on the current
 * screen mode (mobile or desktop).
 *
 * @param {string} taskCategory - The category of the task to be added (e.g., "todo", "progress").
 * @returns {void} This function does not return a value.
 */
function openAddTask(taskCategory) {
    setTaskCategory(taskCategory);
    if (screenMode == "mobile") {
        window.location.href = "add-task.html";
    }
    if (screenMode == "desktop") {
        updateBtnColor(prio);
        classChangeAction("add-task-overlay", "overlaver-active", "toggle");
    }
}

/**
 * Styles all <select> elements on the page.
 */
function styleSelecet() {
    document.querySelectorAll("select").forEach(function (select) {
        select.classList.add("s-hidden");
        var styledSelect = createStyledSelect(select);
        select.parentNode.insertBefore(styledSelect, select.nextSibling);

        var list = createOptionsList(select);
        select.parentNode.insertBefore(list, styledSelect.nextSibling);

        hideFirst(select, list);
        selection(select, styledSelect, list);
    });
}

/**
 * Creates a styled <div> for the selected <select> element.
 * @param {HTMLSelectElement} select - The original <select> element.
 * @returns {HTMLDivElement} The styled <div> element.
 */
function createStyledSelect(select) {
    var styledSelect = document.createElement("div");
    styledSelect.classList.add("styledSelect");
    styledSelect.textContent = select.options[select.selectedIndex].text;
    return styledSelect;
}

/**
 * Creates a <ul> for the options of the <select> element.
 * @param {HTMLSelectElement} select - The original <select> element.
 * @returns {HTMLUListElement} The created <ul> list.
 */
function createOptionsList(select) {
    var list = document.createElement("ul");
    list.classList.add("options");
    return list;
}

/**
 * Adds the options of the <select> element as <li> elements in the <ul>.
 * @param {HTMLSelectElement} select - The original <select> element.
 * @param {HTMLUListElement} list - The <ul> to which the options will be added.
 */
function hideFirst(select, list) {
    Array.from(select.options).forEach(function (option, index) {
        var li = document.createElement("li");
        li.textContent = option.text;
        li.setAttribute("rel", option.value);
        if (index === 0) li.classList.add("hide-first");
        list.appendChild(li);
    });
}

/**
 * Adds event listeners for the styled <div> and the options.
 * @param {HTMLSelectElement} select - The original <select> element.
 * @param {HTMLDivElement} styledSelect - The styled <div> element.
 * @param {HTMLUListElement} list - The <ul> with the options.
 */
function selection(select, styledSelect, list) {
    styledSelect.addEventListener("click", function (e) {
        e.stopPropagation();
        closeOtherSelects(styledSelect);

        styledSelect.classList.toggle("active");
        list.style.display = styledSelect.classList.contains("active") ? "block" : "none";
        if (styledSelect.classList.contains("active")) 
            list.querySelector("li.hide-first").style.display = "none";
    });
    closeList(list, styledSelect, select);
}

/**
 * Closes all other styled dropdowns except the current one.
 * @param {HTMLDivElement} currentSelect - The currently opened styled <div>.
 */
function closeOtherSelects(currentSelect) {
    document.querySelectorAll("div.styledSelect.active").forEach(function (activeSelect) {
        if (activeSelect !== currentSelect) {
            activeSelect.classList.remove("active");
            activeSelect.nextElementSibling.style.display = "none";
        }
    });
}

/**
 * Adds event listeners to close the list and update the selection.
 * @param {HTMLUListElement} list - The <ul> with the options.
 * @param {HTMLDivElement} styledSelect - The styled <div> element.
 * @param {HTMLSelectElement} select - The original <select> element.
 */
function closeList(list, styledSelect, select) {
    list.addEventListener("click", function (e) {
        if (e.target.tagName === "LI") {
            styledSelect.textContent = e.target.textContent;
            styledSelect.classList.remove("active");
            select.value = e.target.getAttribute("rel");
            list.style.display = "none";
        }
    });

    document.addEventListener("click", function () {
        styledSelect.classList.remove("active");
        list.style.display = "none";
    });
}
