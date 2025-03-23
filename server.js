const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000;  // Port na Renderze

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
    res.send(`
        <h1>Witaj w BirdFile!</h1>
        <p>To jest prosty hosting plików.</p>
        <p>Możesz przesłać pliki i pobrać je poniżej.</p>
        <form ref='uploadForm' 
            id='uploadForm' 
            action='/upload' 
            method='post' 
            encType="multipart/form-data">
              <input type="file" name="file" />
              <input type='submit' value='Prześlij plik!' />
        </form>
        <h3>Przesyłanie pliku:</h3>
        <ul>
            <li><a href='/files'>Pobierz listę plików</a></li>
        </ul>
    `);
});

// Endpoint do przesyłania plików
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Brak pliku" });
    res.json({ message: "Plik przesłany", file: req.file.filename });
});

// Endpoint do pobierania listy plików
app.get("/files", (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).json({ error: "Błąd serwera" });
        res.json(files);
    });
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000;  // Port na Renderze

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
    res.send(`
        <h1>Witaj w BirdFile!</h1>
        <p>To jest prosty hosting plików.</p>
        <p>Możesz przesłać pliki i pobrać je poniżej.</p>
        <form ref='uploadForm' 
            id='uploadForm' 
            action='/upload' 
            method='post' 
            encType="multipart/form-data">
              <input type="file" name="file" />
              <input type='submit' value='Prześlij plik!' />
        </form>
        <h3>Przesyłanie pliku:</h3>
        <ul>
            <li><a href='/files'>Pobierz listę plików</a></li>
        </ul>
    `);
});

// Endpoint do przesyłania plików
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Brak pliku" });
    res.json({ message: "Plik przesłany", file: req.file.filename });
});

// Endpoint do pobierania listy plików
app.get("/files", (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).json({ error: "Błąd serwera" });
        res.json(files);
    });
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
