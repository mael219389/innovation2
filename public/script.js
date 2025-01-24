function goToQuestionnaire() {
    window.location.href = 'questionnaire.html';
}

function goToFinished() {
    window.location.href = 'finished.html';
}

function submitForm() {
    const form = document.getElementById('upload-form');
    const formData = new FormData(form);

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            const confirmationMessage = document.createElement('p');
            confirmationMessage.textContent = 'Fichier envoyé avec succès !';
            document.body.appendChild(confirmationMessage);
        }
    })
    .catch(error => {
        console.error('Erreur lors de l\'envoi du fichier :', error);
        alert('Erreur lors de l\'envoi du fichier.');
    });
}

// Démarre le timer dès que la page est chargée
window.onload = function() {
    let timeRemaining = 120; // Temps en secondes
    const timerElement = document.getElementById('time-remaining');
    
    const countdown = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = timeRemaining;
        
        if (timeRemaining <= 0) {
            clearInterval(countdown);
            window.location.href = 'finished.html'; // Redirige vers la page finale
        }
    }, 1000); // Intervalle de 1 seconde
};

// Empêche l'utilisateur de revenir à la page précédente et affiche un message d'erreur
history.pushState(null, null, location.href);
window.onpopstate = function() {
    history.pushState(null, null, location.href);
    document.getElementById('error-message').style.display = 'block';
};

// Gérer l'envoi du formulaire de commentaires (juste un message d'alerte ici)
document.getElementById('feedback-form').onsubmit = function(event) {
    event.preventDefault();
    alert('Merci pour vos commentaires !');
};
