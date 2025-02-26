const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurer le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Dossier où les fichiers seront stockés
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nommer le fichier avec un horodatage
    }
});

const upload = multer({ storage: storage });

// Créer le répertoire de stockage des fichiers si nécessaire
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour la page de formulaire
app.get('/instructions-upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'instructions-upload.html'));
});

// Route pour le dépôt de fichier
app.post('/upload', upload.single('file-upload'), (req, res) => {
    if (req.file) {
        res.json({ message: 'Fichier envoyé avec succès', file: req.file });
    } else {
        res.status(400).json({ message: 'Erreur lors de l\'envoi du fichier' });
    }
});

// Route pour les commentaires
app.post('/feedback', (req, res) => {
    const feedback = req.body.feedback;
    const feedbackPath = path.join(__dirname, 'uploads', 'feedback.txt');
    fs.appendFile(feedbackPath, `Feedback: ${feedback}\n`, (err) => {
        if (err) {
            res.status(500).json({ message: 'Erreur lors de l\'enregistrement des commentaires' });
        } else {
            res.json({ message: 'Commentaire envoyé avec succès' });
        }
    });
});

// Route pour lister les fichiers dans le dossier uploads
app.get('/uploads', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des fichiers' });
        }
        res.json({ files });
    });
});

// Route pour télécharger un fichier spécifique
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);
    res.download(filepath, err => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors du téléchargement du fichier' });
        }
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
