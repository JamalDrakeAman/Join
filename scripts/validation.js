/**
 * Validates form fields for name, email, and phone, and displays error messages if validation fails.
 * 
 * This function checks the validity of name, email, and phone inputs. If any field fails validation, 
 * the corresponding error message is displayed, and error classes are added to the fields.
 * 
 * @param {string} name - The name to be validated.
 * @param {string} email - The email address to be validated.
 * @param {string} phone - The phone number to be validated.
 * @param {string} mode - A mode identifier to differentiate error message elements by their IDs.
 * @returns {boolean} Returns `true` if all fields pass validation, otherwise `false`.
 */
function formValidation(name, email, phone, mode) {
    let isValid = true;
    let nameError = document.getElementById(`name_error_${mode}`);
    let emailError = document.getElementById(`email_error_${mode}`);
    let phoneError = document.getElementById(`phone_error_${mode}`);
    nameError.innerHTML = "";
    emailError.innerHTML = "";
    phoneError.innerHTML = "";
    let nameCheck = checkName(name, nameError)
    let emailCheck = checkEmail(email, emailError)
    let phoneCheck = checkPhone(phone, phoneError)
    if (true == nameCheck && emailCheck && phoneCheck) {
        return isValid;
    }
    addErrorClasses(nameError, emailError, phoneError)
    return false;
}

/**
 * Adds an error message class to each error element to style validation errors.
 *
 * This function applies the CSS class "error-message" to the given elements,
 * typically used to display validation errors for input fields.
 *
 * @param {HTMLElement} nameError - The HTML element to display name-related error messages.
 * @param {HTMLElement} emailError - The HTML element to display email-related error messages.
 * @param {HTMLElement} phoneError - The HTML element to display phone-related error messages.
 */
function addErrorClasses(nameError, emailError, phoneError) {
    nameError.classList.add("error-message");
    emailError.classList.add("error-message");
    phoneError.classList.add("error-message");
}

/**
 * Runs validation checks for name, email, and phone fields.
 *
 * This function calls individual validation functions for each field (name, email, and phone) 
 * and displays error messages if any validation fails.
 * 
 * Note: Assumes that `name`, `email`, `phone`, `nameError`, `emailError`, and `phoneError` are
 * defined in the global scope or accessible within this function.
 */
function check() {
    checkName(name, nameError)
    checkEmail(email, emailError)
    checkPhone(phone, phoneError)
}

/**
 * Validates the name input and displays an error message if validation fails.
 *
 * This function checks if the name is provided and if it starts with a capital letter.
 * If the name is invalid, an appropriate error message is displayed in the `nameError` element.
 *
 * @param {string} name - The name to validate.
 * @param {HTMLElement} nameError - The HTML element where the error message for the name field is displayed.
 * @returns {boolean} Returns `true` if the name is valid, otherwise `false`.
 */
function checkName(name, nameError) {
    let isValid = true;
    if (!name || name.trim() === "") {
        nameError.innerHTML = "Name is required";
        isValid = false;
    } else if (name[0] !== name[0].toUpperCase()) {
        nameError.innerHTML = "Name should start with a capital letter";
        isValid = false;
    }
    return isValid
}

/**
 * Validates the email input and displays an error message if validation fails.
 *
 * This function checks if the email is provided and if it matches a standard email format.
 * If the email is invalid, an appropriate error message is displayed in the `emailError` element.
 *
 * @param {string} email - The email to validate.
 * @param {HTMLElement} emailError - The HTML element where the error message for the email field is displayed.
 * @returns {boolean} Returns `true` if the email is valid, otherwise `false`.
 */
function checkEmail(email, emailError) {
    let isValid = true;
    if (!email || email.trim() === "") {
        emailError.innerHTML = "Email is required";
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.innerHTML = "Please enter a valid email";
        isValid = false;
    }
    return isValid;
}

/**
 * Validates the phone number input and displays an error message if validation fails.
 *
 * This function checks if the phone number is provided and contains only digits.
 * If the phone number is invalid, an appropriate error message is displayed in the `phoneError` element.
 *
 * @param {string} phone - The phone number to validate.
 * @param {HTMLElement} phoneError - The HTML element where the error message for the phone field is displayed.
 * @returns {boolean} Returns `true` if the phone number is valid, otherwise `false`.
 */
function checkPhone(phone, phoneError) {
    let isValid = true;
    if (!phone || phone.trim() === "") {
        phoneError.innerHTML = "Phone number is required";
        isValid = false;
    } else if (!/^\d+$/.test(phone)) {
        phoneError.innerHTML = "Phone number should contain only numbers";
        isValid = false;
    }
    return isValid;
}

/**
 * Validates the input fields for adding a task and displays error messages for invalid fields.
 *
 * This function clears existing error messages and performs validation checks on the title, date, 
 * and category fields required for adding a task. If any of these fields are invalid, the function 
 * displays corresponding error messages and adds an error style class to each field’s error element.
 *
 * @returns {boolean} Returns `true` if all fields are valid, otherwise `false`.
 */
function addTaskValidation() {
    let isValid = true;
    let addTaskTitle = document.getElementById('title-error');
    let addTaskDate = document.getElementById('date-error');
    let addTaskCategory = document.getElementById('category-error');

    addTaskTitle.innerHTML = "";
    addTaskDate.innerHTML = "";
    addTaskCategory.innerHTML = "";

    let titleCheck = checkTitle(addTaskTitle);
    let dateCheck = checkDate(addTaskDate);
    let categoryCheck = checkCategory(addTaskCategory);
    if (true == titleCheck && dateCheck && categoryCheck) {
        return isValid;
    }
    addErrorClasses(addTaskTitle, addTaskDate, addTaskCategory)
    return false;
}

/**
 * Validates the title input for a task and displays an error message if it is empty.
 *
 * This function checks if a title is provided for a task. If the title is empty, an error 
 * message is displayed in the specified `addTaskTitle` element.
 *
 * @param {HTMLElement} addTaskTitle - The HTML element where the error message for the title field is displayed.
 * @returns {boolean} Returns `true` if the title is valid (not empty), otherwise `false`.
 */
function checkTitle(addTaskTitle) {
    let title = document.getElementById("title").value;
    let isValid = true;
    if (!title) {
        addTaskTitle.innerHTML = "Title is required";
        isValid = false;
    }
    return isValid;
}

/**
 * Validates the date input for a task and displays an error message if the date is invalid.
 *
 * This function checks if a date is provided for a task and ensures that the date is today 
 * or later. If the date is invalid, an error message is displayed in the specified `addTaskDate` element.
 *
 * @param {HTMLElement} addTaskDate - The HTML element where the error message for the date field is displayed.
 * @returns {boolean} Returns `true` if the date is valid (not empty and not in the past), otherwise `false`.
 */
function checkDate(addTaskDate) {
    let date = document.getElementById("date").value;
    let isValid = true;
    if (!date) {
        addTaskDate.innerHTML = "Date is required";
        isValid = false;
    } else if (currentDate() > date) {
        addTaskDate.innerHTML = `Value must be ${currentDate()} or later.`;
        isValid = false;
    }
    return isValid;
}

/**
 * Validates the category input for a task and displays an error message if it is not selected.
 *
 * This function checks if a category is selected for a task. If no category is selected, 
 * an error message is displayed in the specified `addTaskCategory` element.
 *
 * @param {HTMLElement} addTaskCategory - The HTML element where the error message for the category field is displayed.
 * @returns {boolean} Returns `true` if the category is valid (selected), otherwise `false`.
 */
function checkCategory(addTaskCategory) {
    let category = document.getElementById("selected-category").value;
    let isValid = true;
    if (!category) {
        addTaskCategory.innerHTML = "Category is required";
        isValid = false;
    }
    return isValid;
}


