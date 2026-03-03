// Gestion du menu mobile
document.querySelectorAll(".dropdown").forEach((button) => {  // ✅ Corrigé : .file → .dropdown
  button.addEventListener("click", (e) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      const content = button.nextElementSibling;
      content.style.visibility =
        content.style.visibility === "visible" ? "hidden" : "visible";
      content.style.opacity = content.style.opacity === "1" ? "0" : "1";
    }
  });
});

// Lien avec le serveur
const API_URL = "http://localhost:3000/api";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";

const moviesGrid = document.getElementById('movies-grid');
const searchInput = document.getElementById('movie-name');
const searchBtn = document.getElementById('search-btn');

async function displayMovies(endpoint) {
    try {
        const res = await fetch(`${API_URL}/${endpoint}`);
        const data = await res.json();

        if (!moviesGrid) return;
        moviesGrid.innerHTML = "";

        //  vérification que data.results existe
        if (!data.results || data.results.length === 0) {
            moviesGrid.innerHTML = "<p style='color:white; text-align:center;'>Aucun film trouvé.</p>";
            return;
        }

        data.results.forEach(movie => {
            const movieEl = document.createElement('div');
            movieEl.classList.add('movie-card');
            movieEl.innerHTML = `
    <img src="${movie.poster_path ? IMG_PATH + movie.poster_path : 'https://via.placeholder.com/500x750'}" alt="${movie.title}">
    <div class="movie-info" style="color: white; padding: 10px; text-align: center;">
        <h4 style="margin: 5px 0;">${movie.title}</h4>
        <span style="color: #f1c40f;">⭐ ${movie.vote_average.toFixed(1)}</span>
    </div>
`;
            moviesGrid.appendChild(movieEl);
        });
    } catch (err) {
        console.error("Erreur de connexion au serveur Node :", err);
    }
}

// Lancement au démarrage
displayMovies("trending");

// Recherche au clic
searchBtn?.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) displayMovies(`search?q=${query}`);
});

// ✅ Ajouté : recherche avec la touche Entrée
searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) displayMovies(`search?q=${query}`);
    }
});