document.getElementById("uploadForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.file) {
            alert("Plik przesłany!");
            loadFiles();  // Załaduj pliki po wysłaniu
        } else {
            alert("Błąd: " + data.error);
        }
    })
    .catch(error => {
        console.error("Błąd:", error);
    });
});

// Funkcja ładująca listę plików
function loadFiles() {
    fetch("/files")
        .then(response => response.json())
        .then(files => {
            const fileList = document.getElementById("fileList");
            fileList.innerHTML = '';  // Wyczyść listę przed dodaniem nowych plików
            files.forEach(file => {
                const li = document.createElement("li");
                li.innerHTML = `${file} <button onclick="deleteFile('${file}')">Usuń</button>`;
                fileList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Błąd:", error);
        });
}

// Funkcja usuwająca plik
function deleteFile(filename) {
    fetch(`/files/${filename}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Plik usunięty") {
            alert("Plik usunięty!");
            loadFiles();  // Załaduj pliki po usunięciu
        }
    })
    .catch(error => {
        console.error("Błąd:", error);
    });
}

// Załaduj pliki przy starcie
loadFiles();
