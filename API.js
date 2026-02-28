const apiKey = "TA_CLE_API_TMDB"; // remplace par ta clé
const btn = document.getElementById("btn");
const searchInput = document.getElementById("search");
const resultsDiv = document.getElementById("results");

btn.addEventListener("click", () => {
    const query = searchInput.value;
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`)
        .then(response => response.json())
        .then(data => {
            resultsDiv.innerHTML = ""; // reset
            data.results.forEach(movie => {
                const p = document.createElement("p");
                p.textContent = movie.title + " (" + movie.release_date + ")";
                resultsDiv.appendChild(p);
            });
        })
        .catch(error => {
            console.error("Erreur API TMDB:", error);
        });
});