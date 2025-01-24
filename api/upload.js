const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads')); // Destination ajustée
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = (req, res) => {
    if (req.method === 'POST') {
        upload.single('file-upload')(req, res, (err) => {
            if (err) {
                return res.status(400).json({ message: 'Erreur lors de l\'envoi du fichier' });
            }
            res.status(200).json({ message: 'Fichier envoyé avec succès', file: req.file });
        });
    } else {
        res.status(405).end(); // Méthode non autorisée
    }
};
