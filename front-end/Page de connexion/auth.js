// Dans Page de connexion/auth.js

document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche la page de se recharger

    const email = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // SUCCESS : On enregistre que l'utilisateur est connecté
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', data.user);
            
            alert('Connexion réussie ! Redirection...');
            window.location.href = '../Films.html'; // Retour à l'accueil
        } else {
            alert(data.message || 'Erreur de connexion');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Le serveur ne répond pas.');
    }
});