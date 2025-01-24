const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    if (req.method === 'POST') {
        const feedback = req.body.feedback;
        const feedbackPath = path.join(__dirname, '..', 'uploads', 'feedback.txt');

        fs.appendFile(feedbackPath, `Feedback: ${feedback}\n`, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de l\'enregistrement des commentaires' });
            }
            res.status(200).json({ message: 'Commentaire envoyé avec succès' });
        });
    } else {
        res.status(405).end(); // Méthode non autorisée
    }
};
