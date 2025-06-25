const filepicker = document.getElementById('filepicker');
filepicker.addEventListener('change', () => {
    const files = filepicker.files

    if (files.length > 0) {
        //  console.log('Neue Datei(en)', files);
        Array.from(files).forEach(async file => {
            const blob = new Blob([file], { type: file.type })
            console.log('Neue Datei(en)', blob);
            const text = await blob.text();
            console.log('Blob:', text);

        });
    }

});