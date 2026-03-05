// Configuration
const API_BASE = "http://localhost:3000/api";
let currentPage = 1;
let isFetching = false;
let currentSearch = "";

// 1. Fonction principale de chargement
async function chargerFilms(page = 1, search = "") {
    if (isFetching) return;
    isFetching = true;

    const endpoint = search 
        ? `${API_BASE}/search?q=${encodeURIComponent(search)}&page=${page}`
        : `${API_BASE}/trending?page=${page}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        const grid = document.getElementById("movies-grid");

        if (!grid) return;
        if (page === 1) grid.innerHTML = "";

        data.results.forEach(movie => {
            const card = document.createElement("div");
            card.className = "movie-card";
            
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

            // --- AJOUT DE LA LOGIQUE DE CLIC ---
            card.addEventListener('click', () => {
                // On vérifie si l'utilisateur est connecté (via localStorage)
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

                if (!isLoggedIn) {
                    alert("⚠️ Veuillez vous connecter pour voir le résumé et le trailer !");
                    // Optionnel: rediriger vers la page de login
                    // window.location.href = "Page de connexion/index1.html";
                    return;
                }

                // Si connecté, on met à jour la bannière (Cover) avec les infos du film
                afficherDetailsFilm(movie);
            });

            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Erreur API :", error);
    } finally {
        isFetching = false;
    }
}

// 2. Fonction pour afficher le Synopsis dans la bannière
function afficherDetailsFilm(movie) {
    const bannerTitle = document.querySelector('.text h3');
    const bannerText = document.querySelector('.text p');
    const bannerImage = document.querySelector('.cover img');

    if (bannerTitle && bannerText) {
        // On remplace le texte par défaut par les infos de TMDB
        bannerTitle.innerText = movie.title;
        bannerText.innerText = movie.overview || "Aucun résumé disponible pour ce film.";
        
        // On change aussi l'image de fond pour celle du film sélectionné
        if (movie.backdrop_path) {
            bannerImage.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
        }
        
        // On scrolle doucement vers le haut pour voir le synopsis
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 3. Gestion de la Recherche
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("movie-name");

function executerRecherche() {
    const query = searchInput.value.trim();
    currentSearch = query;
    currentPage = 1;
    chargerFilms(currentPage, currentSearch);
}

searchBtn?.addEventListener("click", executerRecherche);
searchInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") executerRecherche();
});

// 4. Gestion du Scroll Infini
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100 && !isFetching) {
        currentPage++;
        chargerFilms(currentPage, currentSearch);
    }
});

// 5. Lancement initial
document.addEventListener("DOMContentLoaded", () => {
    chargerFilms(currentPage);
});


async function chargerTrailer(movieId) {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=fr-FR`);
    const data = await response.json();
    
    // On cherche une vidéo de type 'Trailer' sur YouTube
    const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    
    if (trailer) {
        const videoUrl = `https://www.youtube.com/embed/${trailer.key}`;
        // On peut afficher cette vidéo dans un "modal" ou sous le synopsis
        const bannerText = document.querySelector('.text p');
        bannerText.innerHTML += `
            <br><br>
            <iframe width="100%" height="315" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
        `;
    }
}