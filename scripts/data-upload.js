const filepicker = document.getElementById('filepicker');
const gallery = document.getElementById('gallery');
const error = document.getElementById('error');

let allImages = [];

// let isEditMode = false;
// let currentTask = null;



/**
* Komprimiert ein Bild auf eine Zielgröße oder -qualität
* @param {File} file - Die Bilddatei, die komprimiert werden soll
* @param {number} maxWidth - Die maximale Breite des Bildes
* @param {number} maxHeight - Die maximale Höhe des Bildes
* @param {number} quality - Qualität des komprimierten Bildes (zwischen 0 und 1)
* @returns {Promise<string>} - Base64-String des komprimierten Bildes
*/
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Berechnung der neuen Größe, um die Proportionen beizubehalten
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

                canvas.width = width;
                canvas.height = height;

                // Zeichne das Bild in das Canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Exportiere das Bild als Base64
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };

            img.onerror = () => reject('Fehler beim Laden des Bildes.');
            img.src = event.target.result;
        };

        reader.onerror = () => reject('Fehler beim Lesen der Datei.');
        reader.readAsDataURL(file);
    });
}


function render() {
    gallery.innerHTML = '';
    allImages.forEach((image, index) => {
        // gallery.innerHTML += `
        // <div class="img-view-box">
        //   <img class="img-view" src="${image.base64}">
        //   <span class="file-name">${image.filename}</span>
        // </div>`;

        gallery.innerHTML += `
        <div class="img-view-box">
          <img class="img-view" src="${image.base64}">
          <span class="file-name">${image.filename}</span>
          <div class="delete-btn" onclick="deleteImg(${index})">🗑️</div>
        </div>`;
    })

    const myGallery = new Viewer(document.getElementById('gallery'));
}


function save() {
    let arrayAsString = JSON.stringify(allImages);
    localStorage.setItem('allImages', arrayAsString);
}

function load() {
    let arrayAsString = localStorage.getItem('allImages');
    if (arrayAsString) {
        allImages = JSON.parse(arrayAsString);
        render();
    }

}



function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}


function deleteImages() {
    localStorage.removeItem('allImages');
    allImages = [];
    render();
}


function deleteImg(index) {
    allImages.splice(index, 1); // Bild aus dem Array löschen
    save();                     // Speicher aktualisieren
    render();
}


const dropzone = document.getElementById('dropzone');

// Klick auf Dropzone öffnet Filepicker
dropzone.addEventListener('click', () => filepicker.click());


// Visuelles Feedback beim Ziehen
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
});


dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});


dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');

    const files = e.dataTransfer.files;

    // Trick: statt filepicker.files (nicht beschreibbar) --> direkt weiterverarbeiten:
    handleFiles(Array.from(files));
});


async function handleFiles(files) {
    for (const file of files) {
        if (!file.type.startsWith('image/')) {
            console.log('Falscher Typ');
            error.textContent = `Die Datei "${file.name}" ist kein gültiges Bild.`;
            continue;
        }

        const blob = new Blob([file], { type: file.type });

        if (blob.size > 1000000) {
            error.textContent = `Die Datei "${file.name}" ist zu groß.`;
            continue;
        }

        const compressedBase64 = await compressImage(file, 800, 800, 0.7);

        const img = document.createElement('img');
        img.src = compressedBase64;
        gallery.appendChild(img);

        const viewer = new Viewer(img);

        allImages.push({
            filename: file.name,
            fileType: blob.type,
            base64: compressedBase64,
            size: blob.size
        });

        save();
        render();
    }
}


filepicker.addEventListener('change', () => {
    handleFiles(Array.from(filepicker.files));
});