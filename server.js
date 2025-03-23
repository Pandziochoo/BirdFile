const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Tworzymy folder na przesłane pliki, jeśli go nie ma
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Konfiguracja multer (przechowywanie plików)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // folder, w którym pliki będą przechowywane
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // unikalna nazwa pliku
    }
});
const upload = multer({ storage });

// Middleware do obsługi statycznych plików
app.use(express.static("public"));
app.use("/uploads", express.static(uploadDir));

// Endpoint do przesyłania plików
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Brak pliku" });
    }
    res.json({
        message: "Plik przesłany",
        file: req.file.filename, // zwrócenie nazwy pliku
        uploadedAt: new Date().toLocaleString() // data przesyłania
    });
});

// Endpoint do pobierania listy plików
app.get("/files", (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Błąd serwera" });
        }
        res.json(files);
    });
});

// Endpoint do usuwania pliku
app.delete("/files/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: "Nie udało się usunąć pliku" });
        }
        res.json({ message: "Plik usunięty" });
    });
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
