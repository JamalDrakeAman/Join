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
 * Toggles the display of task move options.
 *
 * @param {number} taskId - The ID of the task.
 */
function openTaskMoveOptions(taskId) {
    document.getElementById(`task-move-list${taskId}`).classList.toggle("show-drop-list");
}