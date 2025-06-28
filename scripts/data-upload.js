const filepicker = document.getElementById('filepicker');
const gallery = document.getElementById('gallery');

let allImages = [];



filepicker.addEventListener('change', async () => {
    const files = filepicker.files

    if (files.length > 0) {
        //  console.log('Neue Datei(en)', files);
        Array.from(files).forEach(async file => {
            const blob = new Blob([file], { type: file.type })
            console.log('Neue Datei(en)', blob);

            // const text = await blob.text();
            // console.log('Blob:', text);


            const base64 = await blobToBase64(blob);


            // const img = document.createElement('img');
            // img.src = base64;
            // gallery.appendChild(img);

            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = base64;
                gallery.appendChild(img);
            } else if (file.type === 'application/pdf') {
                const link = document.createElement('a');
                link.href = base64;
                link.target = "_blank";
                link.textContent = '📄 PDF anzeigen';
                gallery.appendChild(link);
            }



            allImages.push({
                filename: file.name,
                fileType: blob.type,
                base64: base64,
                size: blob.size
            });
            // save();
        });
    }

});


function render() {
    gallery.innerHTML = '';
    allImages.forEach(image => {
        gallery.innerHTML += `<img src="${image.base64}">`;
    })
}


// function save() {
//     let arrayAsString = JSON.stringify(allImages);
//     localStorage.setItem('allImages', arrayAsString);
// }

// function load() {
//     let arrayAsString = localStorage.getItem('allImages');
//     if (arrayAsString) {
//         allImages = JSON.parse(arrayAsString);
//         render();
//     }

// }



function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}