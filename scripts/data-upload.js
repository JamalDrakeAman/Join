let allImages = [];
let isEditMode = false;
let myGalleryViewer = null;



/**
 * Initializes the file uploader by setting up the dropzone and file picker.
 * @param {HTMLElement} container - The container element that holds the dropzone and file picker.
 * @param {boolean} [isEdit=false] - Whether the uploader is in edit mode (selects a different file input).
 * @returns {{gallery: HTMLElement, error: HTMLElement}} - The gallery and error DOM elements.
 */
function initUploader(container, isEdit = false) {
    const filepicker = getFilePicker(container, isEdit);
    const dropzone = container.querySelector('#dropzone');
    const gallery = container.querySelector('#gallery');
    const error = container.querySelector('#error');
    setupDropzoneEvents(dropzone, filepicker);
    setupFilepickerEvents(filepicker);
    return { gallery, error };
}


/**
 * Retrieves the correct file input element based on edit mode.
 * @param {HTMLElement} container - The parent container holding the file input.
 * @param {boolean} isEdit - Flag indicating edit mode.
 * @returns {HTMLInputElement} - The file input element.
 */
function getFilePicker(container, isEdit) {
    return container.querySelector(isEdit ? '#filepicker-edit' : '#filepicker');
}


/**
 * Sets up event listeners for the dropzone, including drag and drop behavior.
 * @param {HTMLElement} dropzone - The dropzone element where files can be dragged and dropped.
 * @param {HTMLInputElement} filepicker - The hidden file input triggered by clicking the dropzone.
 */
function setupDropzoneEvents(dropzone, filepicker) {
    dropzone.addEventListener('click', () => filepicker.click());
    dropzone.addEventListener('dragover', e => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });
    dropzone.addEventListener('drop', e => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(Array.from(files));
    });
}


/**
 * Sets up the change event listener for the file input to handle file selection.
 * @param {HTMLInputElement} filepicker - The file input element used to select files.
 */
function setupFilepickerEvents(filepicker) {
    filepicker.addEventListener('change', () => {
        handleFiles(Array.from(filepicker.files));
    });
}


/**
 * Compresses an image to given dimensions and quality.
 * @param {File} file - The image file to compress.
 * @param {number} [maxWidth=800] - Maximum width.
 * @param {number} [maxHeight=800] - Maximum height.
 * @param {number} [quality=0.8] - Compression quality (0 to 1).
 * @returns {Promise<string>} - Base64 string of the compressed image.
 */
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
    return readFileAsDataURL(file)
        .then(loadImage)
        .then(img => resizeAndCompressImage(img, file.type, maxWidth, maxHeight, quality));
}


/**
 * Reads a file and returns its base64-encoded string.
 * @param {File} file
 * @returns {Promise<string>}
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
 * @param {string} base64
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(base64) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject('Fehler beim Laden des Bildes.');
        img.src = base64;
    });
}


/**
 * Resizes and compresses an image to base64.
 * @param {HTMLImageElement} img
 * @param {string} outputType - MIME type of the output image.
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @param {number} quality
 * @returns {Promise<string>} - Compressed base64 string.
 */
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
 * Calculates the resized dimensions maintaining aspect ratio.
 * @param {HTMLImageElement} img
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @returns {{width: number, height: number}}
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
 * Renders the image gallery and initializes viewer if needed.
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
 * Clears the gallery element.
 */
function clearGallery() {
    gallery.innerHTML = '';
}


/**
 * Creates a DOM element for a single image in the gallery.
 * @param {Object} image
 * @param {number} index
 * @param {Function} onLoadCallback
 * @returns {HTMLElement}
 */
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


/**
 * Creates an image DOM element.
 * @param {Object} image
 * @param {Function} onLoadCallback
 * @returns {HTMLImageElement}
 */
function createImage(image, onLoadCallback) {
    const img = document.createElement('img');
    img.classList.add('img-view');
    img.src = image.base64;
    img.alt = image.filename;
    img.onload = onLoadCallback;
    return img;
}


/**
 * Creates a label for the image filename.
 * @param {string} filename
 * @returns {HTMLSpanElement}
 */
function createFilenameLabel(filename) {
    const span = document.createElement('span');
    span.classList.add('file-name');
    span.textContent = filename;
    return span;
}


/**
 * Creates a delete button for an image.
 * @param {number} index
 * @returns {HTMLDivElement}
 */
function createDeleteButton(index) {
    const btn = document.createElement('div');
    btn.classList.add('delete-btn');
    btn.textContent = '🗑️';
    btn.onclick = () => deleteImg(index);
    return btn;
}


/**
 * Initializes the image viewer once all images have loaded.
 * @param {number} loaded
 * @param {number} total
 */
function initViewerWhenAllLoaded(loaded, total) {
    if (loaded !== total) return;
    if (myGalleryViewer) {
        myGalleryViewer.destroy();
    }
    myGalleryViewer = new Viewer(gallery, getViewerOptions());
}


/**
 * Returns Viewer.js configuration options.
 * @returns {Object}
 */
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
 * Destroys the viewer instance if no images remain.
 * @param {number} totalImages
 */
function destroyViewerIfEmpty(totalImages) {
    if (totalImages === 0 && myGalleryViewer) {
        myGalleryViewer.destroy();
        myGalleryViewer = null;
    }
}


/**
 * Saves image array to localStorage.
 */
function save() {
    let arrayAsString = JSON.stringify(allImages);
    localStorage.setItem('allImages', arrayAsString);
}


/**
 * Loads image data from localStorage and renders it.
 */
function load() {
    let arrayAsString = localStorage.getItem('allImages');
    if (arrayAsString) {
        allImages = JSON.parse(arrayAsString);
        render();
    }
}


/**
 * Converts a Blob to a base64 string.
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}


/**
 * Deletes all images and resets gallery and storage.
 */
function deleteImages() {
    localStorage.removeItem('allImages');
    allImages = [];
    render();
}


/**
 * Deletes a single image by index.
 * @param {number} index
 */
function deleteImg(index) {
    allImages.splice(index, 1); // Bild aus dem Array löschen
    save();                     // Speicher aktualisieren
    render();
}



/**
 * Handles file input or drop event.
 * @param {File[]} files
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


/**
 * Checks if the file type and extension are allowed.
 * @param {File} file
 * @returns {boolean}
 */
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


/**
 * Creates an image object for gallery use.
 * @param {File} file
 * @param {Blob} blob
 * @param {string} base64
 * @returns {Object}
 */
function createImageObject(file, blob, base64) {
    return {
        filename: file.name,
        fileType: 'image/jpeg',
        base64: base64,
        size: calculateBase64Size(base64) // richtige Größe des komprimierten Bildes
    };
}


/**
 * Calculates size of base64 string in bytes.
 * @param {string} base64String
 * @returns {number}
 */
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
 * @param {string} message
 */
function showError(message) {
    error.textContent = message;
    setTimeout(() => error.textContent = '', 4000);
}
