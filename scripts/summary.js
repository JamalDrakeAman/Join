let upcomingDeadlineScroll;

function summaryInit() {
    greeting();
    getSummaryTasks();
}

/**
 * Displays the greeting message and user's name on both desktop and mobile versions.
 */
function greeting() {
    let greeting = (document.getElementById("greeting-time").innerHTML = greetingTime());
    let greetUser = (document.getElementById("greeting-name").innerHTML = user);
    let greetingMobile = (document.getElementById("greeting-time-mobile").innerHTML = greetingTime());
    let greetUserMobile = (document.getElementById("greeting-name-mobile").innerHTML = user);
}

/**
 * Returns a greeting based on the current time of day.
 *
 * @function
 * @returns {string} - A greeting message based on the time:
 *   - "Good morning" for hours before 12:00 PM.
 *   - "Good afternoon" for hours between 12:00 PM and 5:00 PM.
 *   - "Good evening" for hours after 5:00 PM.
 */
function greetingTime() {
    let A = new Date();
    let hour = A.getHours();
    if (hour < 12) {
        return `Good morning,`;
    } else if (hour < 17) {
        return `Good afternoon,`;
    } else if (hour < 24) {
        return `Good evening,`;
    }
}

/**
 * Fetches tasks and updates the task counts in the summary view.
 * Handles various task states and priorities.
 */
async function getSummaryTasks() {
    await getTasks();
    document.getElementById("task-count-todo").innerHTML = summaryTaskFilter("todo");
    document.getElementById("task-count-progress").innerHTML = summaryTaskFilter("progress");
    document.getElementById("task-count-feedback").innerHTML = summaryTaskFilter("feedback");
    document.getElementById("task-count-done").innerHTML = summaryTaskFilter("done");
    document.getElementById("task-count-urgent").innerHTML = summaryPrioFilter("urgent");
    document.getElementById("task-count-board").innerHTML = tasksArray.length;
}

/**
 * Filter tasks by their category and return the count of tasks in that category.
 *
 * @param {string} section - The category to filter by (todo, progress, feedback, done)
 * @returns {number} -The number of tasks in the category
 */
function summaryTaskFilter(section) {
    let task = tasksArray.filter((t) => {
        if (t.category == section) {
            return t;
        }
    });
    return task.length;
}

/**
 * Filters tasks by priority and returns the count of tasks in that priority category.
 * Also finds the earliest date from the filtered tasks.
 *
 * @param {string} section - The priority to filter ('urgent',...)
 * @returns {number} - The number of tasks with the specified priority.
 */
function summaryPrioFilter(section) {
    let task = tasksArray.filter((t) => {
        if (t.prio == section) {
            return t;
        }
    });
    findEarliestDate(task);
    return task.length;
}

/**
 * Finds the earliest task by date from a list of tasks and updates the UI with the date.
 *
 * @param {Array} task - The list of tasks to search through.
 * @returns {Object|null} - The task with the earliest date or null if no tasks are found.
 */
function findEarliestDate(task) {
    let earliestUrgentDate = document.getElementById("earliest-urgent-date");
    let earliestDate = null;
  
        
    try{
    task.forEach((item) => {
        let itemDate = new Date(item.date);
        if (!earliestDate || itemDate < new Date(earliestDate.date)) {
            earliestDate = item;
        }
    });
    earliestUrgentDate.innerHTML = earliestDate.date;
    upcomingDeadlineScroll = earliestDate.id;
    return earliestDate;
} catch {
}

}

function goToSummaryTask(section) {
    window.location.href = "board.html#" + "/" + section;
}
