// Dans register.js
const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Compte créé avec succès ! Connectez-vous.");
            window.location.href = '../Page de connexion/index1.html'; // Redirection vers le login
        } else {
            alert(data.message || "Erreur lors de l'inscription");
        }
    } catch (error) {
        console.error("Erreur serveur :", error);
    }
});