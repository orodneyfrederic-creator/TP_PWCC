document.querySelector('.next-button').addEventListener('click', async (e) => {
    e.preventDefault();
    
    // On récupère les valeurs des inputs de ton design
    const email = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
    });

    if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true'); // Active les synopsis !
        window.location.href = '../Films.html'; 
    } else {
        alert("Identifiants incorrects !");
    }
});