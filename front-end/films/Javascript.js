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
let currentPage = 1;
let isFetching = false; // Pour éviter de charger 10 pages en même temps

async function chargerFilms(page = 1) {
    if (isFetching) return;
    isFetching = true;

    try {
        const response = await fetch(`http://localhost:3000/api/trending?page=${page}`);
        const data = await response.json();
        const grid = document.getElementById("movies-grid");

        data.results.forEach(movie => {
            const card = document.createElement("div");
            card.className = "movie-card";
            card.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <div class="movie-info">
                    <h4>${movie.title}</h4>
                </div>
            `;
            grid.appendChild(card);
        });

        isFetching = false;
    } catch (error) {
        console.error("Erreur de chargement :", error);
        isFetching = false;
    }
}

// Détection du scroll
window.addEventListener('scroll', () => {
    // Si on est à moins de 100px du bas de la page
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        currentPage++;
        chargerFilms(currentPage);
    }
});

// Premier chargement
document.addEventListener("DOMContentLoaded", () => chargerFilms(currentPage));