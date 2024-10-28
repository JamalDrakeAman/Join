let contactIndex = getFromLocalStorage("currentDetails");
let contactsArray = getFromLocalStorage("contacts");

/**
 * Initializes the contact list by fetching contacts and rendering them.
 */
async function initContacts() {
    await getContacts();
    await renderContacts();
}

/**
 * Renders the list of contacts in the HTML container, including the user's own contact and their other contacts.
 */
async function renderContacts() {
    let containerRef = document.getElementById("contacts-container");
    containerRef.innerHTML = "";
    let firstLetter = "";
    if (user !== "Guest") {
        containerRef.innerHTML = firstLetterHtml("My User");
        containerRef.innerHTML += ownContactListHtml(await ownContact());
        containerRef.innerHTML += firstLetterHtml("Contacts");
    }

    contacts.forEach((contact, i) => {
        if (firstLetter !== contact.name.charAt(0).toUpperCase()) {
            firstLetter = contact.name.charAt(0).toUpperCase();
            containerRef.innerHTML += firstLetterHtml(firstLetter);
        }
        containerRef.innerHTML += contactListHtml(contact, i);
    });
}

/**
 * Opens the details of a selected contact.
 *
 * @param {number} index - The index of the contact in the contacts array.
 */
async function openContact(index) {
    await initContacts();
    saveToLocalStorage("currentDetails", index);
    saveToLocalStorage("contacts", contacts);
    if (screenMode == "mobile") {
        window.location.href = "contact-details.html";
    } else if (screenMode == "desktop") {
        contactIndex = index;
        contactsArray = contacts;
        classChangeAction("dialog-add-contact", "hide-overlay", "add");
        await showContact();
        highlightContact(index);
    }
}

function highlightContact(i) {
    let ownContactRef = document.getElementById("ownContact");
    let liRef = Array.from(document.getElementsByClassName("contact-list"));
    liRef.forEach((element) => {
        element.classList.remove("contact-highlight");
    });
    if (ownContactRef) {
        ownContactRef.classList.remove("contact-highlight");
    }
    document.getElementById(`contact-list${i}`).classList.add("contact-highlight");
}
/**
 * Opens the current user's own contact details.
 */
async function openOwnContact() {
    if (screenMode == "mobile") {
        saveToLocalStorage("contacts", "user");
        window.location.href = "contact-details.html";
    } else if (screenMode == "desktop") {
        classChangeAction("dialog-add-contact", "hide-overlay", "add");
        await showOwnContact();
        highlightOwnContact();
    }
}

function highlightOwnContact() {
    let liRef = Array.from(document.getElementsByClassName("contact-list"));
    liRef.forEach((element) => {
        element.classList.remove("contact-highlight");
    });
    document.getElementById("ownContact").classList.add("contact-highlight");
}

/**
 * Displays the current user's own contact details.
 */
async function showOwnContact() {
    let currentContact = document.getElementById("current-contact");
    currentContact.innerHTML = contactOwnCirleHTML(await ownContact());
}

/**
 * Changes the edit buttons for the user's own contact in the UI.
 */
function changeOwnEditButtons() {
    document.getElementById("edit-contact").innerHTML = `
        <div class="edit-contact d-flex " onclick="toggleOwnOverlayDisplay()">
            <img src="./assets/icons/edit.png " alt="Edit Button" /> Edit
        </div>
`;
}

/**
 * Saves a value to localStorage.
 *
 * @param {string} key - The key to store the value under.
 * @param {any} value - The value to be stored.
 */
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieves a value from localStorage.
 *
 * @param {string} key - The key of the value to retrieve.
 * @returns {any|null} - The value stored under the key, or null if not found.
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
 * Retrieves and returns user input from the contact form.
 *
 * @param {HTMLElement} nameRef - The input element for the name.
 * @param {HTMLElement} emailRef - The input element for the email.
 * @param {HTMLElement} phoneNumRef - The input element for the phone number.
 */
function getInputs(nameRef, emailRef, phoneNumRef) {
    const name = nameRef.value;
    const email = emailRef.value;
    const phone = phoneNumRef.value;
    const color = randomColor();
    return { name, email, phone, color };
}

/**
 * Toggles the visibility of a dialog and opens the specified contact.
 *
 * @param {string} id - The ID of the dialog to toggle.
 * @param {number} index - The index of the contact to open.
 */
function toogleDialog(id, index) {
    document.getElementById(id).classList.add("dialog-active");

    setTimeout(function () {
        document.getElementById(id).classList.remove("dialog-active");
        buttonRef = document.getElementById("submit-add-contact-btn").removeAttribute("disabled");
        openContact(index);
    }, 2000);
}

/**
 * Finds a contact based on the name, email, and phone.
 *
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 */
async function findContact(name, email, phone) {
    await getContacts();
    return contacts.findIndex((e) => e.name == name && e.email == email && e.phone == phone);
}

/**
 * Clears the input fields for adding a contact.
 */
function clearAddInputs() {
    document.getElementById("add-name-input").value = "";
    document.getElementById("add-mail-input").value = "";
    document.getElementById("add-phone-input").value = "";
}

/**
 * Displays the details of the currently selected contact.
 */
async function showContact() {
    let currentContact = document.getElementById("current-contact");
    if (contactsArray == "user") {
        currentContact.innerHTML = contactOwnCirleHTML(await ownContact());
        changeOwnEditButtons();
    } else {
        let detail = contactsArray[contactIndex];
        currentContact.innerHTML = contactCirleHTML(detail);
    }
}

/**
 * Toggles the display of the edit overlay.
 */
function toggleOverlayDisplay() {
    let overlay = document.getElementById("edit-overlay-bg");
    overlay.classList.toggle("hide-overlay");
    if (screenMode == "desktop") {
        document.getElementById("edit-action-btns").innerHTML = `
                    <button class="edit-delete-btn center" onclick="deleteContact();return false;">Delete</button>
                    <button class="edit-save-btn center">Save <img src="./assets/icons/check.png" alt="" /></button>`;
    }
    editDetails();
}

/**
 * Toggles the display of the user's own contact edit overlay.
 */
function toggleOwnOverlayDisplay() {
    let overlay = document.getElementById("edit-overlay-bg");
    overlay.classList.toggle("hide-overlay");
    document.getElementById("edit-action-btns").innerHTML = `
    <button class="edit-delete-btn center" onclick="deletePopUp(); return false">Delete</button>
    <button class="edit-save-btn center" onclick="editOwnUser(); return false">Save <img src="./assets/icons/check.png" alt="" /></button>`;
    editOwnDetails();
}

/**
 * Populates the edit form with the user's own contact details.
 */
async function editOwnDetails() {
    let currentDetail = await ownContact();
    document.getElementById("edit-name").value = currentDetail.name;
    document.getElementById("edit-email").value = currentDetail.email;
    document.getElementById("edit-phone").value = currentDetail.phone;
    document.getElementById("edit-initals-container").innerHTML = `
    <span style="background-color:${currentDetail.color}" class="edit-initals center">${createInititals(currentDetail.name)}
        <details class="change-color">
           <summary>
              Change Color
           </summary>
           <input id="edit-color" type="color" value="${currentDetail.color}">
       </details>    
                    </span>
    `;
}

/**
 * Displays a delete confirmation popup for the user.
 */
function deletePopUp() {
    document.getElementById("delete-user-popup").classList.toggle("d-none");
}

/**
 * Populates the edit form with the currently selected contact's details.
 */
function editDetails() {
    let currentDetail = contactsArray[contactIndex];
    document.getElementById("edit-name").value = currentDetail.name;
    document.getElementById("edit-email").value = currentDetail.email;
    document.getElementById("edit-phone").value = currentDetail.phone;
    document.getElementById("edit-initals-container").innerHTML = `
    <span style="background-color:${currentDetail.color}" class="edit-initals center">${createInititals(currentDetail.name)}
                         <details class="change-color">
           <summary>
              Change Color
           </summary>
           <input id="edit-color" type="color" value="${currentDetail.color}">
       </details>    
                    </span>
    `;
}

/**
 * Displays the edited contact's details.
 *
 * @param {Array} contacts - The array of contact objects.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 */
async function showEditedContact(contacts, name, email, phone) {
    saveToLocalStorage("contacts", contacts);
    if (screenMode == "mobile") {
        window.location.href = "contact-details.html";
    } else if (screenMode == "desktop") {
        await initContacts();
        openContact(await findContact(name, email, phone));
        classChangeAction("edit-overlay-bg", "hide-overlay", "add");
    }
}




