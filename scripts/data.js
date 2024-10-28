/**
 * Sends a new task to the server via a POST request.
 *
 * This asynchronous function gathers task data from input fields and the current
 * application state, then sends this data to the server at the specified path
 * ("/tasks") using the `postData` function. The data includes the task title,
 * description, date, assigned contacts (filtered to include only those checked),
 * the current category, priority, selected category text, and any subtasks.
 */
async function postTask() {
    await postData(
        (path = "/tasks"),
        (data = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            date: document.getElementById("date").value,
            assignedTo: filterCheckedAssignedTo(),
            category: currentCategory,
            prio: prio,
            categoryText: document.getElementById("selected-category").value,
            subtask: currentSubtasks,
        })
    );
}

/**
 * Fetches tasks from the server, processes them, and updates the `tasksArray`.
 */
async function getTasks() {
    let response = await getData((path = "/tasks"));
    if (response) {
        let taskKeys = Object.keys(response);
        tasksArray = [];
        for (let index = 0; index < taskKeys.length; index++) {
            const key = taskKeys[index];
            let task = response[key];
            tasksArray.push({
                title: task.title,
                description: task.description,
                id: index,
                date: task.date,
                assignedTo: task.assignedTo,
                category: task.category,
                prio: task.prio,
                categoryText: task.categoryText,
                subtask: task.subtask,
                taskKey: taskKeys[index],
            });
        }
    }
}


/**
 * Moves the dragged task to update the database. Fetches the current tasks,
 * identifies the task key for the dragged element, and updates the database.
 *
 * @returns {Promise<void>} A promise that resolves when the task is updated.
 */
async function moveToUpdateDatabase() {
    let getTasks = await getData("/tasks");
    let taskKey = Object.keys(getTasks);
    await putData(`/tasks/${taskKey[currentDraggedElement]}`, tasksArray[currentDraggedElement]);
}


/**
 * Toggles the subtask's checked status and updates the backend data.
 *
 * @param {number} subIndex - The index of the subtask to toggle.
 */
async function checkAndPushToFirebase(subIndex) {
    currentTask.subtask[subIndex].checked = !currentTask.subtask[subIndex].checked;
    setCheck();
    await putData(
        (path = `/tasks/${currentTask.taskKey}/subtask/${subIndex}`),
        (data = {
            checked: currentTask.subtask[subIndex].checked,
            sub: currentTask.subtask[subIndex].sub,
        })
    );
    await getTasks();
    await resetBoard();
}

/**
 * Saves the edited task to the database.
 */
async function editTask() {
    await putData(
        (path = `/tasks/${currentTask.taskKey}`),
        (data = {
            id: currentTask.id,
            category: currentTask.category,
            categoryText: currentTask.categoryText,
            title: document.getElementById("edit-title-input").value,
            description: document.getElementById("edit-textarea").value,
            date: document.getElementById("edit-date-input").value,
            prio: currentTask.prio,
            assignedTo: filterCheckedAssignedTo(),
            subtask: currentSubtasks,
            taskKey: currentTask.taskKey,
        })
    );
    await resetBoard();
    openTask(currentTask.id);
}

/**
 * Deletes the task from the backend.
 */
async function deleteTask() {
    classChangeAction("overlaver", "overlaver-active", "remove");
    await deleteData((path = `/tasks/${currentTask.taskKey}`), (data = {}));
    resetBoard();
}

/**
 * Moves a task to a different category and updates it in the databse.
 *
 * @param {number} taskId - The ID of the task.
 * @param {string} category - The new category to move the task to.
 */
async function moveTaskTo(taskId, category) {
    await putData(
        (path = `/tasks/${tasksArray[taskId].taskKey}/`),
        (data = {
            id: taskId,
            category: category,
            categoryText: tasksArray[taskId].categoryText,
            title: tasksArray[taskId].title,
            description: tasksArray[taskId].description,
            date: tasksArray[taskId].date,
            prio: tasksArray[taskId].prio,
            assignedTo: tasksArray[taskId].assignedTo,
            subtask: tasksArray[taskId].subtask,
            taskKey: tasksArray[taskId].taskKey,
        })
    );
    await resetBoard();
}

/**
 * Adds a new contact by collecting input data and saving it to the backend.
 */
async function addContact() {
    let nameRef = document.getElementById("add-name-input");
    let emailRef = document.getElementById("add-mail-input");
    let phoneNumRef = document.getElementById("add-phone-input");
    let inputs = getInputs(nameRef, emailRef, phoneNumRef);
    if (!formValidation(nameRef.value, emailRef.value, phoneNumRef.value, "add")) {
        return;
    }
    document.getElementById("submit-add-contact-btn").setAttribute("disabled", true);
    clearInput(nameRef);
    clearInput(emailRef);
    clearInput(phoneNumRef);

    await postData((path = "contacts"), (data = { name: `${inputs.name}`, email: `${inputs.email}`, phone: `${inputs.phone}`, color: `${inputs.color}` }));
    const contactIndex = await findContact(inputs.name, inputs.email, inputs.phone);
    toogleDialog("dialog-add-succes", contactIndex);
}

/**
 * Saves the user's own contact details after editing.
 */
async function editOwnUser() {
    let name = document.getElementById("edit-name").value;
    let email = document.getElementById("edit-email").value;
    let phone = document.getElementById("edit-phone").value;
    let color = document.getElementById("edit-color").value;
    let pw = await getData(`users/${userId}/password`);

    await putData(
        (path = `/users/${userId}`),
        (data = {
            color: color,
            name: name,
            email: email,
            phone: phone,
            password: pw,
        })
    );
    if (screenMode == "desktop") {
        await initContacts();
    }
    showOwnContact();
    toggleOwnOverlayDisplay();
}

/**
 * Deletes the user's account and logs them out.
 */
async function deleteOwnUser() {
    await deleteData((path = `/users/${userId}`));
    logOut();
}

/**
 * Saves the edited contact details to the backend.
 */
async function editContact() {
    await getContacts();
    let name = document.getElementById("edit-name").value;
    let email = document.getElementById("edit-email").value;
    let phone = document.getElementById("edit-phone").value;
    let color = document.getElementById("edit-color").value;
    if (!formValidation(name, email, phone, "edit")) {
        return;
    }
    await putData(
        (path = `/contacts/${contacts[contactIndex].key}`),
        (data = {
            color: color,
            name: name,
            email: email,
            phone: phone,
        })
    );
    await getContacts();
    showEditedContact(contacts, name, email, phone);
}

/**
 * Deletes the selected contact and removes it from the backend.
 */
async function deleteContact() {
    await getContacts();
    await deleteTaskContact(contacts[contactIndex].key);
    await deleteData((path = `/contacts/${contacts[contactIndex].key}`), (data = {}));
    if (screenMode == "mobile") {
        window.location.href = "contact.html";
    } else if (screenMode == "desktop") {
        document.getElementById("current-contact").innerHTML = "";
        await initContacts();
    }
}

/**
 * Deletes a contact from all tasks where it has been assigned.
 *
 * This function fetches all tasks from the server, iterates over each task,
 * and checks if the contact is assigned to that task. If the contact is found,
 * it is removed from the task's assigned contacts. The updated task is then
 * sent back to the server.
 *
 * @param {string} deleteKey - The unique key of the contact to be deleted from the assigned tasks.
 * @returns {Promise<void>} - A promise that resolves once the contact has been removed from all relevant tasks.
 */
async function deleteTaskContact(deleteKey) {
    let response = await getData("/tasks"); // Warten auf das Auflösen der Daten
    let keyOfTask = Object.keys(response); // Extrahiere die Keys aus den Tasks

    for (let i = 0; i < keyOfTask.length; i++) {
        const key = keyOfTask[i];
        let task = response[key];
        if (task.assignedTo) {
            let assignedKey = Object.keys(task.assignedTo);

            let assignedTo = [];
            for (let j = 0; j < assignedKey.length; j++) {
                const assignKey = assignedKey[j];
                let assignContact = task.assignedTo[assignKey];

                if (assignContact.key !== deleteKey) {
                    assignedTo.push(assignContact);
                }
            }
            await putData((path = `/tasks/${key}/assignedTo`), assignedTo);
        }
    }
}