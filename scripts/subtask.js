/**
 * Updates the subtask button based on the content of the input field.
 *
 * This function checks if the subtask input field has any text. If it does,
 * it updates the button's inner HTML to display a custom button. If the input
 * field is empty, it resets the button to show a default image.
 */
function subtaskInputBtn() {
    let subtaskInput = document.getElementById("subtasks-input");
    let subtaskButtons = document.getElementById("add-subtask-btn");

    if (subtaskInput.value.length > 0) {
        subtaskButtons.innerHTML = subtaskBtnHTML();
    } else {
        subtaskButtons.innerHTML = `<img src="./assets/icons/add -subtasks.png" alt=""></img>`;
    }
}

/**
 * Sets the focus on the subtask input field.
 *
 * This function retrieves the subtask input element by its ID and applies focus to it,
 * allowing the user to start typing immediately.
 */
function setInputFocus() {
    document.getElementById("subtasks-input").focus();
}

/**
 * Clears the subtask input field and updates the button state.
 *
 * This function sets the value of the subtask input field to an empty string,
 * effectively clearing it. After clearing, it calls the `subtaskInputBtn` function
 * to update the button's appearance based on the new input state.
 */
function clearSubtask() {
    let subtaskInput = document.getElementById("subtasks-input");
    subtaskInput.value = "";
    subtaskInputBtn();
}

/**
 * Adds a subtask to the current subtasks array and updates the display.
 *
 * This function retrieves the value from the subtask input field, adds a new
 * subtask object to the `currentSubtasks` array, and then calls the
 * `renderSubtask` function to update the UI. Finally, it clears the input field
 * and updates the button state.
 */
function addSubtask() {
    let subtaskInput = document.getElementById("subtasks-input");
    currentSubtasks.push({
        sub: subtaskInput.value,
        checked: false,
    });
    renderSubtask();
    subtaskInput.value = "";
    subtaskInputBtn();
}

/**
 * Generates HTML for a subtask.
 *
 * @param {Object} subtask - The subtask object.
 * @param {number} index - The index of the subtask in the array.
 * @returns {string} - HTML string representing the subtask.
 */
function renderSubtask() {
    let subtaskContainer = document.getElementById("subtasks-container");
    subtaskContainer.innerHTML = "";
    for (let i = 0; i < currentSubtasks.length; i++) {
        const subtask = currentSubtasks[i];
        subtaskContainer.innerHTML += subtaskTaskHTML(subtask, i);
    }
}

/**
 * Edits a subtask by updating the display to show edit icons for the specified index.
 *
 * This function generates the HTML for the subtasks, displaying an edit icon for
 * the selected subtask. Other subtasks are shown as clickable items that can be edited.
 *
 * @param {number} index - The index of the subtask to edit.
 */
function editWord(index) {
    let wordListHTML = "";
    for (let i = 0; i < currentSubtasks.length; i++) {
        if (i === index) {
            wordListHTML += editIconsHTML(i);
        } else {
            wordListHTML += `<div class="word-item">
                <span onclick="editWord(${i})">${currentSubtasks[i].sub}</span>
            </div>`;
        }
    }
    document.getElementById("subtasks-container").innerHTML = wordListHTML;
}

/**
 * Saves the edited subtask by updating its value and re-rendering the subtasks list.
 *
 * @param {number} index - The index of the subtask to be updated.
 * @returns {boolean} - Returns false to prevent any default form submission behavior.
 */
function saveWord(index) {
    const newValue = document.getElementById(`editInput${index}`).value;
    if (newValue.length > 0) {
        currentSubtasks[index].sub = newValue;
        renderSubtask();
        return false;
    } else {
        deleteSubtask(index);
    }
}

/**
 * Deletes a subtask from the currentSubtasks array by its index.
 *
 * @param {number} i - The index of the subtask to be deleted.
 */
function deleteSubtask(i) {
    currentSubtasks.splice(i, 1);
    renderSubtask();
}