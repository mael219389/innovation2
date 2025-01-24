const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const uploadFile = (req, res) => {
    upload.single('file-upload')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: 'Erreur lors de l\'envoi du fichier' });
        }
        res.status(200).json({ message: 'Fichier envoyé avec succès', file: req.file });
    });
};

module.exports = (req, res) => {
    if (req.method === 'POST') {
        return uploadFile(req, res);
    }
    res.status(405).end(); // Méthode non autorisée
};
