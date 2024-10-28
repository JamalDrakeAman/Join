/**
 * Handles the sign-up process by collecting user inputs and performing validation checks.
 *
 * This function collects the user's name, email, password, and confirmation password from the input fields,
 * then calls validation functions to check if the user already exists and applies error styles if necessary.
 */

async function signUp() {
    let userNameInput = document.getElementById("name-input").value;
    let userEmailInput = document.getElementById("email-input").value;
    let userPwd = document.getElementById("user-pwd").value;
    let userConfPwd = document.getElementById("user-conf-pwd").value;
    checkbox = document.getElementById("myCheckbox");                         
    await checkIfUserAllreadyExists(userNameInput, userEmailInput, userPwd, userConfPwd, checkbox);
    errorStyles(userNameInput, userEmailInput, userPwd, userConfPwd);
}

/**
 * Capitalizes the first letter of the username and posts sign-up data.
 *
 * @async
 * @param {string} userEmailInput - The user's email address.
 * @param {string} userPwd - The user's password.
 */
async function capitalizeFirstLetter(userEmailInput, userPwd) {
    let userNameInput = document.getElementById("name-input");
    let userNameValue = userNameInput.value;
    if (userNameValue.length > 0) {
        let capitalizedUserName = userNameValue.charAt(0).toUpperCase() + userNameValue.slice(1);
        userNameValue = capitalizedUserName;
        await postSignUpData(userNameValue, userEmailInput, userPwd);
    }
}

/**
 * Checks if the email contains an "@" symbol and applies error styles if not.
 *
 * @param {string} emailInput - The user's email address.
 * @param {HTMLElement} userEmailError - The HTML element to display email errors.
 * @param {HTMLElement} userEmailContainer - The HTML element for the email input container.
 */
function checkIfEmailHaveAnAtt(emailInput, userEmailError, userEmailContainer) {
    if (!containsAtSymbol(emailInput) && emailInput !== "") {
        userEmailError.textContent = "Your email isn't an Email";
        userEmailError.classList.add("visible");
        userEmailContainer.classList.add("red-border");
        shake(userEmailError);
    } else {
        document.getElementById("email-error").classList.remove("visible");
        document.getElementById("email-input-container").classList.remove("red-border");
    }
}

/**
 * Adds a "shake" animation to an error element.
 *
 * @param {HTMLElement} Error - The error element to shake.
 */
function shake(Error) {
    Error.classList.add("shake");
    setTimeout(() => {
        Error.classList.remove("shake");
    }, 300);
}

/**
 * Checks if an email address contains an "@" symbol.
 *
 * @param {string} emailInput - The user's email address.
 */
function containsAtSymbol(emailInput) {
    return emailInput.includes("@");
}

/**
 * Displays an error message if the terms and conditions checkbox is not checked.
 */
function checkboxError() {
    checkbox = document.getElementById("myCheckbox");
    if (!checkbox.checked) {
        let checkboxError = document.getElementById("checkbox-error");
        checkboxError.textContent = "Please agree to our terms and conditions!";
        checkboxError.classList.add("visible");
        shake(checkboxError);
    } else {
        document.getElementById("checkbox-error").classList.remove("visible");
        document.getElementById("checkbox-container").classList.remove("red-border");
    }
}

/**
 * Applies error styles to the username input if empty.
 *
 * @param {string} userNameInput - The user's name.
 */
function userInputErrorStyle(userNameInput) {
    if (userNameInput === "") {
        let userNameError = document.getElementById("name-error");
        let userNameContainer = document.getElementById("name-input-container");
        userNameError.textContent = "Please enter your name!";
        userNameError.classList.add("visible");
        userNameContainer.classList.add("red-border");
        shake(userNameError);
    } else {
        document.getElementById("name-error").classList.remove("visible");
        document.getElementById("name-input-container").classList.remove("red-border");
    }
}

/**
 * Applies error styles to the email input if empty or invalid.
 *
 * @param {string} userEmailInput - The user's email address.
 */
function emailInputErrorStyle(userEmailInput) {
    let userEmailError = document.getElementById("email-error");
    let userEmailContainer = document.getElementById("email-input-container");
    if (userEmailInput === "") {
        userEmailError.textContent = "Please enter your Email!";
        userEmailError.classList.add("visible");
        userEmailContainer.classList.add("red-border");
        shake(userEmailError);
    } else {
        checkIfEmailHaveAnAtt(userEmailInput, userEmailError, userEmailContainer);
        shake(userEmailError);
        document.getElementById("email-error").classList.remove("visible");
        document.getElementById("email-input-container").classList.remove("red-border");
    }
}

/**
 * Applies error styles to the password input if empty.
 *
 * @param {string} userPwd - The user's password.
 */
function passwordInputErrorStyle(userPwd) {
    if (userPwd === "") {
        let userPwdError = document.getElementById("password-error");
        let userPwdContainer = document.getElementById("pwd-input-container");
        userPwdError.textContent = "Please enter any Password!";
        userPwdError.classList.add("visible");
        userPwdContainer.classList.add("red-border");
        shake(userPwdError);
    } else {
        document.getElementById("password-error").classList.remove("visible");
        document.getElementById("pwd-input-container").classList.remove("red-border");
    }
}

/**
 * Applies error styles to the password confirmation input if empty.
 *
 * @param {string} userConfPwd - The user's password confirmation.
 */
function passwordConfInputErrorStyle(userConfPwd) {
    if (userConfPwd === "") {
        let userConfPwdError = document.getElementById("conf-pwd-error");
        let userConfPwdContainer = document.getElementById("conf-pwd-input-container");
        userConfPwdError.textContent = "Please confirm your Password!";
        userConfPwdError.classList.add("visible");
        userConfPwdContainer.classList.add("red-border");
        shake(userConfPwdError);
    } else {
        document.getElementById("conf-pwd-error").classList.remove("visible");
        document.getElementById("conf-pwd-input-container").classList.remove("red-border");
    }
}

/**
 * Checks if the password and confirmation match, and applies error styles if they don't.
 *
 * @param {string} userPwd - The user's password.
 * @param {string} userConfPwd - The user's password confirmation.
 */
function checkIfConfPwd(userPwd, userConfPwd) {
    if (userPwd !== userConfPwd) {
        let userConfPwdError = document.getElementById("conf-pwd-error");
        let userConfPwdContainer = document.getElementById("conf-pwd-input-container");
        userConfPwdError.textContent = "Your passwords don't match. Please try again.";
        userConfPwdError.classList.add("visible");
        userConfPwdContainer.classList.add("red-border");
        shake(userConfPwdError);
    } else {
        document.getElementById("conf-pwd-error").classList.remove("visible");
        document.getElementById("conf-pwd-input-container").classList.remove("red-border");
    }
}

/**
 * Checks if all required inputs are filled in and valid.
 *
 * @async
 * @param {string} userNameInput - The user's name.
 * @param {string} userEmailInput - The user's email address.
 * @param {string} userPwd - The user's password.
 * @param {string} userConfPwd - The user's password confirmation.
 * @param {Object} user - User object containing user data.
 */
async function checkIfAllInputsFilled(userNameInput, userEmailInput, userPwd, userConfPwd, user, nameExists, emailExists) {
    if (userNameInput === "" && userEmailInput === "" && userPwd !== userConfPwd && !checkbox.checked && !emailInput.includes("@")) {
        errorStyles(userNameInput, userEmailInput, userPwd, userConfPwd);
    } else if ((userNameInput !== "" && userEmailInput !== "" && userPwd !== "" && userConfPwd !== "" && userPwd == userConfPwd && checkbox.checked && user.email !== userEmailInput && user.name !== userNameInput) || (nameExists == false && emailExists == false)) {
        userSuccessfullySignedup();
    }
}

/**
 * Sends user sign-up data to the server.
 *
 * @async
 * @param {string} userNameInput - The user's name.
 * @param {string} userEmailInput - The user's email address.
 * @param {string} userPwd - The user's password.
 */
async function postSignUpData(userNameInput, userEmailInput, userPwd) {
    await postData(
        (path = "/users"),
        (data = {
            name: userNameInput,
            email: userEmailInput,
            password: userPwd,
            color: "#29ABE3",
        })
    );
    document.getElementById("name-input").value = "";
    document.getElementById("email-input").value = "";
    document.getElementById("user-pwd").value = "";
    document.getElementById("user-conf-pwd").value = "";

    setTimeout(() => {
        goLogin();
    }, 1500);
}

/**
 * Redirects the user to the login page.
 */
function goLogin() {
    window.location.href = "index.html";
}

/**
 * Applies error styles to various input fields.
 *
 * @param {string} userNameInput - The user's name.
 * @param {string} userEmailInput - The user's email address.
 * @param {string} userPwd - The user's password.
 * @param {string} userConfPwd - The user's password confirmation.
 */
function errorStyles(userNameInput, userEmailInput, userPwd, userConfPwd) {
    let userEmailError = document.getElementById("email-error");
    let userEmailContainer = document.getElementById("email-input-container");
    userInputErrorStyle(userNameInput);
    checkIfEmailHaveAnAtt(userEmailInput, userEmailError, userEmailContainer);
    emailInputErrorStyle(userEmailInput);
    passwordInputErrorStyle(userPwd);
    passwordConfInputErrorStyle(userConfPwd);
    checkIfConfPwd(userPwd, userConfPwd);
    checkboxError();
}

/**
 * Checks if a user already exists based on the provided inputs.
 *
 * @async
 * @param {string} userNameInput - The user's name.
 * @param {string} userEmailInput - The user's email address.
 * @param {string} userPwd - The user's password.
 * @param {string} userConfPwd - The user's password confirmation.
 * @param {HTMLElement} checkbox - The terms and conditions checkbox element.
 */
async function checkIfUserAllreadyExists(userNameInput, userEmailInput, userPwd, userConfPwd, checkbox) {
    let users = await getData("users");
    let nameExists = false;
    let emailExists = false;
    if (users) {
        let userIds = Object.keys(users);
        hideErrorMsg("name-error");
        hideErrorMsg("email-error");
       ({ nameExists, emailExists } = checkUserNameAndEmail(users, userIds, userNameInput, userEmailInput, nameExists, emailExists, userPwd, userConfPwd));

        if (checkbox.checked && userNameInput !== "" && userEmailInput !== "" && userEmailInput.includes("@") && userPwd !== "" && userConfPwd !== "" && userPwd === userConfPwd && nameExists == false && emailExists == false) {
            await capitalizeFirstLetter(userEmailInput, userPwd);
        }
    }
    else {await capitalizeFirstLetter(userEmailInput, userPwd);}
}

function checkUserNameAndEmail(users, userIds, userNameInput, userEmailInput, nameExists, emailExists, userPwd, userConfPwd) {
    for (let i = 0; i < userIds.length; i++) {
        let user = users[userIds[i]];
        nameExists = checkNameExist(user, userNameInput, nameExists);
        emailExists = checkEmailExist(user, userEmailInput, emailExists);
        if (nameExists || emailExists) break;
    }
      return { nameExists, emailExists };
}

/**
 * Checks if a name already exists and applies an error message if it does.
 *
 * @param {Object} user - The user object to check.
 * @param {string} userNameInput - The user's name.
 * @param {boolean} nameExists - Whether the name already exists.
 */
function checkNameExist(user, userNameInput, nameExists) {
    if (user.name.toLowerCase() === userNameInput.toLowerCase()) {
        nameExists = true;
        userAlreadyExistsMsg("name-error", "Name");
    } else {
    return nameExists;}
}

/**
 * Checks if an email already exists and applies an error message if it does.
 *
 * @param {Object} user - The user object to check.
 * @param {string} userEmailInput - The user's email address.
 * @param {boolean} emailExists - Whether the email already exists.
 */
function checkEmailExist(user, userEmailInput, emailExists) {
    if (user.email == userEmailInput) {
        emailExists = true;
        userAlreadyExistsMsg("email-error", "Email");
    } else {
    return emailExists;}
}

/**
 * Hides an error message element.
 *
 * @param {string} errorInput - The ID of the error element.
 */
function hideErrorMsg(errorInput) {
    let errorRef = document.getElementById(errorInput);
    errorRef.innerHTML = "";
    errorRef.style.display = "none";
}

/**
 * Displays a message indicating that the user already exists.
 *
 * @param {string} errorInput - The ID of the error element.
 * @param {string} errorText - The type of error (e.g., "Name" or "Email").
 */
function userAlreadyExistsMsg(errorInput, errorText) {
    let errorRef = document.getElementById(errorInput);
    errorRef.innerHTML = `User ${errorText} already exists`;
    errorRef.style.display = "block";
    shake(errorRef);
}

/**
 * Displays a success message when the user successfully signs up.
 */
function userSuccessfullySignedup() {
    toogleDialog("dialog-signup-succes");
}

/**
 * Toggles the visibility of a dialog.
 *
 * @param {string} id - The ID of the dialog element.
 */
function toogleDialog(id) {
    document.getElementById(id).classList.add("dialog-active");

    setTimeout(function () {
        document.getElementById(id).classList.remove("dialog-active");
    }, 2000);
}
