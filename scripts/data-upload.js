const filepicker = document.getElementById('filepicker');
const gallery = document.getElementById('gallery');
const error = document.getElementById('error');
const dropzone = document.getElementById('dropzone');

let allImages = [];
let isEditMode = false;
let myGalleryViewer = null;



function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
    return readFileAsDataURL(file)
        .then(loadImage)
        .then(img => resizeAndCompressImage(img, file.type, maxWidth, maxHeight, quality));
}


/**
 * Reads a file and returns its base64-encoded string.
 * @param {File} file - The file to read.
 * @returns {Promise<string>} - Base64 string of the file.
 */
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject('Fehler beim Lesen der Datei.');
        reader.readAsDataURL(file);
    });
}


/**
 * Loads an image from a base64 string.
 * @param {string} base64 - Base64-encoded image source.
 * @returns {Promise<HTMLImageElement>} - Loaded image element.
 */
function loadImage(base64) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject('Fehler beim Laden des Bildes.');
        img.src = base64;
    });
}



function resizeAndCompressImage(img, outputType = 'image/jpeg', maxWidth, maxHeight, quality) {
    const { width, height } = getResizedDimensions(img, maxWidth, maxHeight);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    return new Promise((resolve) => {
        canvas.toBlob(blob => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        }, outputType, quality);
    });
}


/**
 * Calculates resized dimensions while keeping aspect ratio.
 * @param {HTMLImageElement} img - The original image.
 * @param {number} maxWidth - Maximum width.
 * @param {number} maxHeight - Maximum height.
 * @returns {{width: number, height: number}} - New dimensions.
 */
function getResizedDimensions(img, maxWidth, maxHeight) {
    let width = img.width;
    let height = img.height;
    if (width > maxWidth || height > maxHeight) {
        if (width > height) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        } else {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }
    }
    return { width, height };
}


/**
 * Renders the image gallery and initializes Viewer.
 */
function render() {
    clearGallery();
    const totalImages = allImages.length;
    let loadCount = 0;
    allImages.forEach((image, index) => {
        const imgBox = createImageElement(image, index, () => {
            loadCount++;
            initViewerWhenAllLoaded(loadCount, totalImages);
        });
        gallery.appendChild(imgBox);
    });
    destroyViewerIfEmpty(totalImages);
}


/**
 * Clears the gallery DOM container.
 */
function clearGallery() {
    gallery.innerHTML = '';
}


/**
 * Creates the DOM element for a single image box.
 * @param {Object} image - The image object.
 * @param {number} index - Index in image array.
 * @param {Function} onLoadCallback - Called when image is loaded.
 * @returns {HTMLDivElement} - Image container element.
 */
// function createImageElement(image, index, onLoadCallback) {
//     const imgBox = document.createElement('div');
//     imgBox.classList.add('img-view-box');
//     const img = document.createElement('img');
//     img.classList.add('img-view');
//     img.src = image.base64;
//     img.alt = image.filename; 
//     img.onload = onLoadCallback;
//     const span = document.createElement('span');
//     span.classList.add('file-name');
//     span.textContent = image.filename;
//     const deleteBtn = document.createElement('div');
//     deleteBtn.classList.add('delete-btn');
//     deleteBtn.textContent = '🗑️';
//     deleteBtn.onclick = () => deleteImg(index);
//     imgBox.appendChild(img);
//     imgBox.appendChild(span);
//     imgBox.appendChild(deleteBtn);
//     return imgBox;
// }


function createImageElement(image, index, onLoadCallback) {
    const imgBox = document.createElement('div');
    imgBox.classList.add('img-view-box');

    const img = createImage(image, onLoadCallback);
    const span = createFilenameLabel(image.filename);
    const deleteBtn = createDeleteButton(index);

    imgBox.appendChild(img);
    imgBox.appendChild(span);
    imgBox.appendChild(deleteBtn);

    return imgBox;
}

function createImage(image, onLoadCallback) {
    const img = document.createElement('img');
    img.classList.add('img-view');
    img.src = image.base64;
    img.alt = image.filename;
    img.onload = onLoadCallback;
    return img;
}

function createFilenameLabel(filename) {
    const span = document.createElement('span');
    span.classList.add('file-name');
    span.textContent = filename;
    return span;
}

function createDeleteButton(index) {
    const btn = document.createElement('div');
    btn.classList.add('delete-btn');
    btn.textContent = '🗑️';
    btn.onclick = () => deleteImg(index);
    return btn;
}


// function initViewerWhenAllLoaded(loaded, total) {
//     if (loaded === total) {
//         if (myGalleryViewer) {
//             myGalleryViewer.destroy();
//         }
//         myGalleryViewer = new Viewer(gallery, {
//             navbar: false,
//             title: function (image) {
//                 return image.alt || 'Untitled';
//             },
//             toolbar: {
//                 zoomIn: 1,
//                 zoomOut: 1,
//                 oneToOne: 1,
//                 reset: 1,
//                 prev: 1,
//                 play: false,
//                 next: 1,
//                 rotateLeft: 1,
//                 rotateRight: 1,
//                 flipHorizontal: 1,
//                 flipVertical: 1,
//                 download: function (image) {
//                     const link = document.createElement('a');
//                     link.href = image.src;
//                     link.download = image.alt || 'download.jpg';
//                     link.click();
//                 }
//             }
//         });
//     }
// }


function initViewerWhenAllLoaded(loaded, total) {
    if (loaded !== total) return;

    if (myGalleryViewer) {
        myGalleryViewer.destroy();
    }

    myGalleryViewer = new Viewer(gallery, getViewerOptions());
}


function getViewerOptions() {
    return {
        navbar: false,
        title: image => image.alt || 'Untitled',
        toolbar: {
            zoomIn: 1,
            zoomOut: 1,
            oneToOne: 1,
            reset: 1,
            prev: 1,
            play: false,
            next: 1,
            rotateLeft: 1,
            rotateRight: 1,
            flipHorizontal: 1,
            flipVertical: 1,
            download: image => {
                const link = document.createElement('a');
                link.href = image.src;
                link.download = image.alt || 'download.jpg';
                link.click();
            }
        }
    };
}


/**
 * Destroys the viewer instance if no images are left.
 * @param {number} totalImages - Total number of images.
 */
function destroyViewerIfEmpty(totalImages) {
    if (totalImages === 0 && myGalleryViewer) {
        myGalleryViewer.destroy();
        myGalleryViewer = null;
    }
}


/**
 * Saves the current image list to localStorage.
 */
function save() {
    let arrayAsString = JSON.stringify(allImages);
    localStorage.setItem('allImages', arrayAsString);
}


/**
 * Loads the image list from localStorage and renders it.
 */
function load() {
    let arrayAsString = localStorage.getItem('allImages');
    if (arrayAsString) {
        allImages = JSON.parse(arrayAsString);
        render();
    }
}


/**
 * Converts a Blob to a base64-encoded string.
 * @param {Blob} blob - The blob to convert.
 * @returns {Promise<string>} - Base64 string.
 */
function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}


/**
 * Deletes all stored images and clears the gallery.
 */
function deleteImages() {
    localStorage.removeItem('allImages');
    allImages = [];
    render();
}


/**
 * Deletes a single image by index.
 * @param {number} index - Index of the image to delete.
 */
function deleteImg(index) {
    allImages.splice(index, 1); // Bild aus dem Array löschen
    save();                     // Speicher aktualisieren
    render();
}


/**
 * Handles click event on the dropzone.
 * Triggers the hidden file input element to open the file picker dialog.
 */
dropzone.addEventListener('click', () => filepicker.click());


/**
 * Handles the dragover event on the dropzone.
 * Prevents the default behavior to allow dropping,
 * and visually indicates that the dropzone is active.
 * 
 * @param {DragEvent} e - The dragover event object.
 */
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
});


/**
 * Handles the dragleave event on the dropzone.
 * Removes the visual highlight when the dragged item leaves the dropzone.
 */
dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});


/**
 * Handles the drop event on the dropzone.
 * Prevents the default behavior, removes the visual highlight,
 * retrieves the dropped files, and passes them to the file handler.
 * 
 * @param {DragEvent} e - The drop event object.
 */
dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFiles(Array.from(files));
});


/**
 * Handles file drop or selection input.
 * @param {File[]} files - Array of uploaded files.
 */
async function handleFiles(files) {
    for (const file of files) {
        if (!isFileTypeAllowed(file)) {
            showError(`❌ Die Datei "${file.name}" ist kein erlaubtes Format. Nur JPEG und PNG sind erlaubt.`);
            continue;
        }
        const blob = new Blob([file], { type: file.type });
        if (!isFileSizeAllowed(blob)) {
            showError(`❌ Die Datei "${file.name}" ist zu groß. Maximal 5 MB erlaubt.`);
            continue;
        }
        const compressedBase64 = await compressImage(file, 800, 800, 0.7);
        const imageObj = createImageObject(file, blob, compressedBase64);
        addImage(imageObj);
    }
}



function isFileTypeAllowed(file) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    return allowedTypes.includes(file.type) && allowedExtensions.includes(ext);
}


/**
 * Validates the file size.
 * @param {Blob} blob - File blob to check.
 * @returns {boolean} - True if size is acceptable.
 */
function isFileSizeAllowed(blob) {
    return blob.size <= 5000000;
}



function createImageObject(file, blob, base64) {
    return {
        filename: file.name,
        fileType: 'image/jpeg',
        base64: base64,
        size: calculateBase64Size(base64) // richtige Größe des komprimierten Bildes
    };
}

function calculateBase64Size(base64String) {
    let base64 = base64String.split(',')[1];
    let padding = (base64.endsWith('==')) ? 2 : (base64.endsWith('=') ? 1 : 0);
    return Math.ceil((base64.length * 3) / 4) - padding;
}




/**
 * Adds an image to the appropriate image list and renders.
 * @param {Object} imageObj - Image metadata.
 */
function addImage(imageObj) {
    if (isEditMode) {
        if (!currentTask.files) currentTask.files = [];
        currentTask.files.push(imageObj);
        renderEditGallery(currentTask);
    } else {
        allImages.push(imageObj);
        save();
        render();
    }
}


/**
 * Displays an error message temporarily.
 * @param {string} message - Message to display.
 */
function showError(message) {
    error.textContent = message;
    setTimeout(() => error.textContent = '', 4000);
}


/**
 * Handles the change event on the hidden file input.
 * Converts the selected FileList into an array and passes it to the file handler.
 */
filepicker.addEventListener('change', () => {
    handleFiles(Array.from(filepicker.files));
});