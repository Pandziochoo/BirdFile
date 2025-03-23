const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000;

// Tworzymy folder na przesłane pliki, jeśli go nie ma
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Konfiguracja multer (przechowywanie plików)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Middleware do obsługi statycznych plików
app.use(express.static("public"));
app.use("/uploads", express.static(uploadDir));

// Endpoint do wyświetlania strony głównej
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint do przesyłania plików
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Brak pliku" });
    const fileInfo = {
        filename: req.file.filename,
        date: new Date().toLocaleString()
    };
    fs.appendFileSync("files.json", JSON.stringify(fileInfo) + '\n');
    res.redirect('/');
});

// Endpoint do pobierania listy plików
app.get("/files", (req, res) => {
    const files = [];
    fs.readdir(uploadDir, (err, filenames) => {
        if (err) return res.status(500).json({ error: "Błąd serwera" });
        filenames.forEach(filename => {
            files.push({
                filename: filename,
                date: new Date(fs.statSync(path.join(uploadDir, filename)).mtime).toLocaleString()
            });
        });
        res.json(files);
    });
});

// Endpoint do usuwania plików
app.delete("/delete/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);
    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).json({ error: "Nie udało się usunąć pliku" });
        res.status(200).json({ message: "Plik usunięty" });
    });
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
