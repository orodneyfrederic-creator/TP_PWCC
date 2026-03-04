document.querySelectorAll(".file").forEach((button) => {
  button.addEventListener("click", (e) => {
    if (window.innerWidth < 768) {
      e.preventDefault(); // Empêche de suivre le lien
      const content = button.nextElementSibling;
      content.style.visibility =
        content.style.visibility === "visible" ? "hidden" : "visible";
      content.style.opacity = content.style.opacity === "1" ? "0" : "1";
    }
  });
});

// Configuration de l'adresse de ton serveur Node.js
const API_URL = "http://localhost:3000/api/trending";

// Fonction pour récupérer et afficher les films
async function chargerFilms() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const grid = document.getElementById("movies-grid");

        if (!grid) {
            console.error("Erreur : La balise <div id='movies-grid'> est introuvable dans ton HTML !");
            return;
        }

        // On vide la grille avant d'ajouter les films
        grid.innerHTML = "";

        data.results.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");
            
            movieCard.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <div class="movie-info">
                    <h4>${movie.title}</h4>
                    <span>${movie.release_date.split('-')[0]}</span>
                </div>
            `;
            grid.appendChild(movieCard);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des films :", error);
    }
}

// Lancer le chargement dès que la page est prête
document.addEventListener("DOMContentLoaded", chargerFilms);
