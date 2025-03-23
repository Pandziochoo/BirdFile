// Obsługa przesyłania plików
document.getElementById('upload-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', document.getElementById('file').files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.file) {
            addFileToList(data.file, data.url);
        }
    })
    .catch(error => {
        alert('Wystąpił błąd podczas przesyłania pliku');
        console.error(error);
    });
});

// Funkcja do dodawania pliku do listy
function addFileToList(file, url) {
    const fileList = document.getElementById('uploaded-files');
    const fileItem = document.createElement('div');
    fileItem.innerHTML = `
        <a href="${url}" target="_blank">${file}</a>
        <button class="delete" onclick="deleteFile('${file}')">Usuń</button>
    `;
    fileList.appendChild(fileItem);
}

// Funkcja do usuwania pliku
function deleteFile(file) {
    fetch(`/files/${file}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.querySelector(`a[href*='${file}']`).parentElement.remove();
    })
    .catch(error => {
        alert('Wystąpił błąd podczas usuwania pliku');
        console.error(error);
    });
}

// Pobranie listy plików po załadowaniu strony
fetch('/files')
    .then(response => response.json())
    .then(files => {
        files.forEach(file => {
            addFileToList(file, `/uploads/${file}`);
        });
    })
    .catch(error => {
        console.error('Błąd podczas pobierania plików:', error);
    });
