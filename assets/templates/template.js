function mobileHeader(user) {
    return /*html*/ `<header class="d-flex header-mobile">
      <img class="logo-mobile" src="./assets/icons/logo-dark.svg" alt="Join Logo" />
      <div onclick="classChangeAction('menu', 'menu-active', 'toggle'), stopEventBubbling(event)" id="current-user-header" class="current-user-header center">${user}</div>
      <div id="menu" class="column menu">
        <a href="./help.html">Help</a>
        <a href="./legal-notice.html">Legal Notice</a>
        <a href="./privacy-policy.html">Privacy Policy</a>
        <a onclick="logOut()" href="#">Log out</a>
      </div>
    </header>`;
}

function desktopHeader(user) {
    return /*html*/ `
        <header class="header-desktop">
        <p class="header-title">Kanban Project Management Tool</p>
        <div class="header-actions">
            <a id="help-icon" href="help.html"> <img class="help-icon" src="./assets/icons/help-icon.png" alt="Help"></a>
            <div onclick="classChangeAction('user-menu', 'd-none', 'toggle'); stopEventBubbling(event)" id="header-initials" class="header-initials-btn">
                ${user}
            </div>
        </div>
        
       <nav id="user-menu" class="user-menu d-none">
        <a href="legal-notice.html">Legal Notice</a>
        <a href="privacy-policy.html">Privacy Policy</a>
        <a onclick="logOut()" href="#">Log out</a>
       </nav>

    </header>`;
}

function mobileSidebar() {
    return /*html*/ `<aside class="d-flex sidebar-mobile">
      <a class="center column nav-link-mobile" id="summary-link" href="./summary.html"><img src="./assets/icons/summary-icon.png"
          alt="Summary" />Summary</a>
      <a class="center column nav-link-mobile" id="board-link" href="./board.html"><img src="./assets/icons/board-icon.png"
          alt="Board" />Board</a>
      <a class="center column nav-link-mobile" id="add-task-link" href="./add-task.html" onclick="setTaskCategory('todo')"><img src="./assets/icons/add-task-icon.png"

          alt="Add Task"  />Add Task</a>

      <a class="center column nav-link-mobile" id="contact-link" href="./contact.html"><img src="./assets/icons/contacts-icon.png"
          alt="Contacts" />Contacts</a>
    </aside>`;
}

function desktopSidebar() {
    return /*html*/ `<aside class="sidebar-desktop">
        <img class="sidebar-logo-desktop" src="./assets/icons/join-logo-light.png" alt="">
        <nav class="sidebar-nav">

            <a class="nav-link-desktop" id="summary-link" href="summary.html"><img src="./assets/icons/summary-icon.png" > Summary</a>
            <a class="nav-link-desktop" id="add-task-link"  href="add-task.html" onclick="setTaskCategory('todo')"><img src="./assets/icons/add-task-icon.png" > Add Task</a>

            <a class="nav-link-desktop" id="board-link"  href="board.html"><img src="./assets/icons/board-icon.png" > Board</a>
            <a class="nav-link-desktop" id="contact-link"  href="contact.html"><img src="./assets/icons/contacts-icon.png" > Contacts</a>
        </nav>
        <div class="sidebar-info">
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="legal-notice.html">Legal notice</a>
        </div>
    </aside>`;
}

function generateTaskHTML(task, index, className) {
    return /*html*/ `<div id="${task.id}" draggable="true" ondragstart="startDragging(${task.id})"  onclick="classChangeAction('overlaver','overlaver-active','add'); openTask(${task.id})" class="task-wrapper">
            <div class ="task">
              <div class="task-category ${className}">${task.categoryText}</div>
              <span class="drag-drop-btn">
                <img class="drag-drop-icon" src="./assets/icons/up-down-arrow.png" alt="" onclick="openTaskMoveOptions(${task.id});stopEventBubbling(event)">
                <ul id="task-move-list${task.id}" class="drag-drop-list">
                    <li onclick="moveTaskTo(${task.id}, 'todo');stopEventBubbling(event)">To do</li>
                    <li onclick="moveTaskTo(${task.id}, 'progress');stopEventBubbling(event)">Progress</li>
                    <li onclick="moveTaskTo(${task.id}, 'feedback');stopEventBubbling(event)">Feedback</li>
                    <li onclick="moveTaskTo(${task.id}, 'done');stopEventBubbling(event)">Done</li>
                </ul>
              </span>
              <h4 class="task-title">${task.title}</h4>
              <div class="task-description">${task.description}</div>
              <div class="d-flex task-amount-container">
                  <div id="${task.category}progress-bar${index}" class="progress-bar d-none">
                      <div class="progress" id="${task.category}-progress${index}"></div>
                  </div>
                  <div id="${task.category}-amount${index}" class="task-amount"></div>
              </div>
              <div class="d-flex task-footer">
                  <div id="${task.category}contatcs-container${index}" class="d-flex contatcs-container"></div>
                  <div id="${task.category}contatcs-container${index}num" class="d-flex contatcs-container"></div>
                  <img id="${task.category}prio-icon${index}" class="prio-icon d-none" src="" alt="">
              </div> 
           </div>
               </div>`;
}

function generateNoTaskHTML(noTask) {
    return /*html*/ `<div class="no-task"> No task in ${noTask}</div> `;
}

function contactCirleHTML(detail) {
    return /*html*/ `
    <div class="detail-container">
        <div class="contact-name-details">
            <span class="name-initals" style="background:${detail.color}">${createInititals(detail.name)}</span>
            <div class="name-detail">
                ${detail.name}
                <div class="edit-details-btns">
                    <button onclick="toggleOverlayDisplay()"><img src="./assets/icons/edit.png"/>Edit</button>
                    <button onclick="deleteContact()"><img src="./assets/icons/delete.png" />Delete</button>
                </div>
            </div>
        </div>
        <p class="info-headline">Contact Information</p>
        <div class="contact-info-box">
            <span>Email</span>
            <a href="mailto:${detail.email}">${detail.email}</a>
            <span>Phone</span>
            <a href="tel:${detail.phone}">${detail.phone}</a>
        </div>
    </div>
    `;
}

function contactOwnCirleHTML(detail) {
    return /*html*/ `
    <div class="detail-container">
        <div class="contact-name-details">
            <span class="name-initals" style="background:${detail.color}">${createInititals(detail.name)}</span>
            <div class="name-detail">
                ${detail.name}
                <div class="edit-details-btns">
                    <button onclick="toggleOwnOverlayDisplay()"><img src="./assets/icons/edit.png"/>Edit</button>
                </div>
            </div>
        </div>
        <p class="info-headline">Contact Information</p>
        <div class="contact-info-box">
            <span>Email</span>
            <a href="mailto:${detail.email}">${detail.email}</a>
            <span>Phone</span>
            <a href="tel:${detail.phone}">${detail.phone}</a>
        </div>
    </div>
    `;
}

function firstLetterHtml(firstLetter) {
    return /*html*/ `<div class="contacts-first-letter">${firstLetter}</div>`;
}

function contactListHtml(contact, i) {
    return /*html*/ `<div onclick="openContact(${i})" id="contact-list${i}" class="contact-list d-flex">
      <span class="contact-initials center" style="background:${contact.color}">${createInititals(contact.name)}</span>
      <div>
        <p>${contact.name}</p>
        <a href="#">${contact.email}</a>
      </div>
    </div>`;
}

function ownContactListHtml(contact) {
    return /*html*/ `<div onclick="openOwnContact()" id="ownContact" class="contact-list d-flex">
      <span class="contact-initials center" style="background:${contact.color}">${createInititals(contact.name)}</span>
      <div>
        <p>${contact.name}</p>
        <a href="#">${contact.email}</a>
      </div>
    </div>`;
}


function contactInDropDownHTML(contact, initials) {
    return /*html*/ `
            <li id="contact${contact.id}" onclick="selectContact(${contact.id}); stopEventBubbling(event)">
                <div class="d-flex contact-row">
                    <div class="center gap">
                        <div class="contact center" style="background-color:${contact.color}">${initials}</div>
                        <span>${contact.name}</span>
                    </div>
                    <div class="container">
                        <input type="checkbox" id="checkbox${contact.id}" onclick="selectContact('${contact.name}'); stopEventBubbling(event)">
                        <span class="checkmark"></span>
                    </div>
                </div>
            </li>`;
}

function userInDropDownHTML(initials, userIndex) {
    return /*html*/ `
            <li id="contact${userIndex}" onclick="selectContact(${userIndex}); stopEventBubbling(event)">
                <div class="d-flex contact-row">
                    <div class="center gap">
                        <div class="contact center userBackground">${initials}</div>
                        <span>${user}</span>
                    </div>
                    <div class="container">
                        <input type="checkbox" id="checkbox${userIndex}" onclick="selectContact('${userIndex}'); stopEventBubbling(event)">
                        <span class="checkmark"></span>
                    </div>
                </div>
            </li>`;
}

function contactSelectionCircleHTML(contact) {
    return /*html*/ `<div class="contact center " style="background-color:${contact.color}">${createInititals(contact.name)}</div>`;
}


function subtaskBtnHTML() {
    return /*html*/ `
        <div class="subtasks-btns">

         <div class="svg-btn" onclick="clearSubtask()"> 
            <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M6.24959 6.99984L11.4926 12.2428M1.00659 12.2428L6.24959 6.99984L1.00659 12.2428ZM11.4926 1.75684L6.24859 6.99984L11.4926 1.75684ZM6.24859 6.99984L1.00659 1.75684L6.24859 6.99984Z" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
           </svg>
        </div>

           <span class="break-line"></span>

           <div class="svg-btn" onclick="addSubtask()">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M5.79923 9.15L14.2742 0.675C14.4742 0.475 14.7117 0.375 14.9867 0.375C15.2617 0.375 15.4992 0.475 15.6992 0.675C15.8992 0.875 15.9992 1.1125 15.9992 1.3875C15.9992 1.6625 15.8992 1.9 15.6992 2.1L6.49923 11.3C6.29923 11.5 6.0659 11.6 5.79923 11.6C5.53256 11.6 5.29923 11.5 5.09923 11.3L0.79923 7C0.59923 6.8 0.503397 6.5625 0.51173 6.2875C0.520064 6.0125 0.62423 5.775 0.82423 5.575C1.02423 5.375 1.26173 5.275 1.53673 5.275C1.81173 5.275 2.04923 5.375 2.24923 5.575L5.79923 9.15Z" fill="black"/>
           </svg>
        </div>
          
        </div>
`;
}

function subtaskTaskHTML(subtask, i) {
    return /*html*/ `
        <div id="subtask${i}" class="subtask">
           <div class="subtask-text" onclick="editWord(${i})">
             <p>${subtask.sub}</p> 
             <img class="edit-icon" src="./assets/icons/edit.png" alt="">
           </div>
           <span class="break-line"></span>
            <img class="edit-icon" src="./assets/icons/delete.png" alt="" onclick="deleteSubtask(${i})">
        </div>
        `;
}

function editIconsHTML(i) {
    return /*html*/ `<div class="word-item">
                <input type="text" id="editInput${i}" value="${currentSubtasks[i].sub}">
                <button  onclick="deleteSubtask(${i})"><img class="svg-btn" src="./assets/icons/delete.png" alt=""></button>
                <span class="break-line"></span>
                <button>
                <svg class="svg-btn" onclick="saveWord(${i})" width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.79911 9.15L14.2741 0.675C14.4741 0.475 14.7116 0.375 14.9866 0.375C15.2616 0.375 15.4991 0.475 15.6991 0.675C15.8991 0.875 15.9991 1.1125 15.9991 1.3875C15.9991 1.6625 15.8991 1.9 15.6991 2.1L6.49911 11.3C6.29911 11.5 6.06578 11.6 5.79911 11.6C5.53245 11.6 5.29911 11.5 5.09911 11.3L0.799113 7C0.599113 6.8 0.50328 6.5625 0.511613 6.2875C0.519946 6.0125 0.624113 5.775 0.824113 5.575C1.02411 5.375 1.26161 5.275 1.53661 5.275C1.81161 5.275 2.04911 5.375 2.24911 5.575L5.79911 9.15Z" fill="black"/>
                 </svg>
                </button>
                
            </div>`;
}


function taskBoardOverlay(currentTask) {
    return /*html*/ ` <div class="task-overlay-bg" >
        <div class="task-overlay" onclick="stopEventBubbling(event)">
            <div class="task-overlay-category-container">
                <span class="task-overlay-category ${currentTask.categoryText.replace(" ", "-").toLowerCase()}">${currentTask.categoryText}</span>
                <img class="task-overlay-close-icon" src="./assets/icons/close-icon-dark.png" alt="" onclick="classChangeAction('overlaver','overlaver-active','remove');">
            </div>
            <h1 class="task-overlay-title">
            ${currentTask.title}
            </h1>

            <div class="task-overlay-scroll-container">
              <p class="task-overlay-description">${currentTask.description}</p>
             <table class="task-overlay-prio-date-table">
                  <tr>
                      <td>Due date:</td>
                      <td>${currentTask.date}</td>
                  </tr>
                  <tr>
                      <td>Priority:</td>
                      <td id="prio"></td>
                  </tr>
              </table>
              <div class="task-overlay-assigned">
                  Assigned To:
                  <ul class="task-overlay-assigned-to-list" id="assigned-to-list"></ul>
              </div>
              <div class="task-overlay-subtasks-container">
                  Subtasks
                  <div class="subtask-overlay" id="subtask-overlay"></div>
              </div>
            </div>

            <div class="task-overlay-edit-btns">
                <button class="task-overlay-btn" onclick="deleteTask()"><img src="./assets/icons/delete.png" alt="Delete">Delete</button>
                <span class="btn-breakline"></span>
                <button class="task-overlay-btn" onclick="showEditTaskValues()"><img src="./assets/icons/edit.png" alt="Edit">Edit</button>
            </div>

        </div>
    </div>`;
}

function generateAssignedToOerlayLiHTML(contact) {
    return /*html*/ `
                        <li class="assigned-to-contact">
                                <div title="${contact.name}" class="initials-circle center" style="background-color:${contact.color};">${createInititals(contact.name)}</div>
                                <span class="name">${contact.name}</span>
                        </li>`;
}

function editBoardTaskHTML(currentTask) {
    return /*html*/ `
    <div class="task-overlay-bg">
        <form onsubmit="editTask(); return false" class="task-overlay" onclick="closeDropdown(); stopEventBubbling(event)">
            <div class="task-overlay-category-container">
                <span id="category-text" class="task-overlay-category"" style="background-color:powderblue;">${currentTask.categoryText}</span>
                <img class="task-overlay-close-icon" src="./assets/icons/close-icon-dark.png"
                    onclick="classChangeAction('overlaver','overlaver-active','remove')">
            </div>
              <div>
                  <label for="title">Title</label>
                <input id="edit-title-input" class="edit-title-input" type="text" required value="${currentTask.title}">
              </div>
              <div class="task-overlay-scroll-container">
                <div>
                    <label for="description">Description</label>
                    <textarea id="edit-textarea" class="edit-textarea" name="description"
                        placeholder="Enter a Description">${currentTask.description}</textarea>
                </div>
                <table class="task-overlay-prio-date-table">
                    <tr>
                        <td>Due date:</td>
                        <td><input id="edit-date-input" class="edit-date-input" value="${currentTask.date}" type="date"></td>
                    </tr>
                    <tr>
                        <td>Priority:</td>
                        <td id="prio"></td>
                    </tr>
                </table>
                <div class="d-flex row">
                    <button id="urgent-btn" class=" btn prio-btn" type="button"
                        onclick="editPrio('urgent'), stopEventBubbling(event)">Urgent<img id="prio-icon-urgent"
                            src="./assets/icons/prio-urgent-icon.png"></button>
                    <button id="medium-btn" class="btn prio-btn" type="button" onclick="editPrio('medium')">Medium<img
                            id="prio-icon-medium" src="./assets/icons/prio-medium-icon.png"></button>
                    <button id="low-btn" class="btn prio-btn" type="button" onclick="editPrio('low')">Low<img
                            id="prio-icon-low" src="./assets/icons/prio-low-icon.png"></button>
                </div>
                <div class="task-overlay-assigned position-relative">
                    Assigned To:
                    <div id="dropdown" class="drop-down d-flex">
                        <input id="assign-to-dropdown" class="input" onkeyup="filter('assign-to-dropdown')"
                            onclick="handleInputClick(event)" value="Select contacts to assign">
                        <button class="btn dropdown-btn" onclick="handleDropdownButtonClick(event)" type="button">
                            <img id="drop-down-icon1" src="./assets/icons/arrow-drop-down.png">
                        </button>
                    </div>
                    <ul id="assign-to-dropdown-contacts" class="dropdown-options edit-dropdown"></ul>
                    <div id="selected-contacts-container" class="d-flex selectet-contacts-container"></div>
                </div>
                <div class="task-overlay-subtasks-container position-relative" >
                    Subtasks
                    <div class="add-task-input">
                        <input id="subtasks-input" type="subtasks" name="subtasks" onkeyup="subtaskInputBtn()"
                            placeholder="Add new subtask" />
                        <div class="add-subtask-btn" id="add-subtask-btn">
                            <img src="./assets/icons/add -subtasks.png" alt="" onclick="setInputFocus()" />
                        </div>
                    </div>
                <div id="subtasks-container" class="subtasks-container"></div>
                </div>
            </div>
            <button class="btn submit submit-btn" >Ok <img src="./assets/icons/check.png"></button>
        </form>
    </div>`;
}
