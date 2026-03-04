// Configuration
const API_BASE = "http://localhost:3000/api";
let currentPage = 1;
let isFetching = false;
let currentSearch = ""; // Stocke la recherche actuelle

// 1. Fonction principale de chargement (Trending ou Search)
async function chargerFilms(page = 1, search = "") {
    if (isFetching) return;
    isFetching = true;

    // Détermine quelle route appeler selon si on recherche ou non
    // Note : On utilise 'q' car c'est ce que ton serveur attend
    const endpoint = search 
        ? `${API_BASE}/search?q=${encodeURIComponent(search)}&page=${page}`
        : `${API_BASE}/trending?page=${page}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        const grid = document.getElementById("movies-grid");

        if (!grid) return;

        // Si c'est la première page d'une nouvelle recherche, on vide la grille
        if (page === 1) grid.innerHTML = "";

        if (data.results.length === 0 && page === 1) {
            grid.innerHTML = `<p style="color:white; grid-column: 1/-1; text-align:center;">Aucun résultat trouvé.</p>`;
            return;
        }

        data.results.forEach(movie => {
            const card = document.createElement("div");
            card.className = "movie-card";
            // Gestion de l'image manquante
            const poster = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                : 'assets/no-image.png';

            card.innerHTML = `
                <img src="${poster}" alt="${movie.title}">
                <div class="movie-info">
                    <h4>${movie.title}</h4>
                    <span>${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Erreur API :", error);
    } finally {
        isFetching = false;
    }
}

// 2. Gestion de la Recherche
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("movie-name");

function executerRecherche() {
    const query = searchInput.value.trim();
    currentSearch = query; // Met à jour le terme actuel
    currentPage = 1;       // Réinitialise à la page 1
    chargerFilms(currentPage, currentSearch);
}

searchBtn.addEventListener("click", executerRecherche);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") executerRecherche();
});

// 3. Gestion du Scroll Infini
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    // Si on arrive à 100px du bas
    if (scrollTop + clientHeight >= scrollHeight - 100 && !isFetching) {
        currentPage++;
        chargerFilms(currentPage, currentSearch);
    }
});

// 4. Lancement initial
document.addEventListener("DOMContentLoaded", () => {
    chargerFilms(currentPage);
});