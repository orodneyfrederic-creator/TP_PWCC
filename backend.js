// Chargement des variables d'environnement depuis le fichers .env (pour la clé API TMDB)
require('dotenv').config();


// On recupère la clé d'API TMDB 
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";


//  * IMPORTATION DES MODULES NATIFS

const http = require('http'); // Gestion du protocole HTTP
const url = require('url');   // Analyse des chaînes d'URL


//  * CONFIGURATION ET CRÉATION DU SERVEUR

const server = http.createServer( async(req, res) => {
    
    // Analyse de la requête entrante
    const parsedUrl = url.parse(req.url, true);
    
    // Normalisation du chemin (suppression des slashs finaux)
    const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';
    
    // Extraction des paramètres de recherche (Query string)
    const queryData = parsedUrl.query;

   
    //  * CONFIGURATION DES HEADERS (CORS & CONTENT-TYPE)
    //  * Autorise les requêtes provenant d'origines différentes (Front-end externe)
    
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };


    

    
    //  * GESTION DU PREFLIGHT (MÉTHODE OPTIONS)
    //  * Réponse automatique aux vérifications de sécurité des navigateurs
     


    if (req.method === "OPTIONS") {
        res.writeHead(204, headers);
        res.end();
        return;
    }

    // Journalisation des requêtes reçues pour le débogage
    console.log(`[LOG] Requête : ${req.method} ${pathname}`);

   
    //  * ROUTAGE DE L'API

    // Route 1 : Tendance pour l'acceuil et l'infinite scroll

    if (pathname === "/api/trending" && req.method === "GET") {
        try{
            const page = queryData.page || 1 ;
            const response = await fetch(`${ BASE_URL }/trending/movie/week?api_key=${ TMDB_API_KEY }&language=fr-FR&page=${ page }`);
            const data = await response.json();


            res.writeHead(200, headers);
            res.end(JSON.stringify(data));
        } catch (error) {
            res.writeHead(500, headers);
            res.end(JSON.stringify({error: "Erreur lors de la récupération des tendances"}));
        }
        return;

    }


    // Route 2 : Recherche de films par mot-clé

    if (pathname === "/api/search" && req.method === "GET") {
        try {
            const searchTerm = queryData.q;
            const page = queryData.page || 1;

            if (!searchTerm) {
                res.writeHead(400, headers);
                res.end(JSON.stringify({ error: "Recherche vide" }));
                return;
            }

            const response = await fetch(`${ BASE_URL }/search/movie?api_key=${ TMDB_API_KEY }&language=fr-FR&query=${ encodeURIComponent(searchTerm) }&page=${ page }`);
            const data = await response.json();

            res.writeHead(200, headers);
            res.end(JSON.stringify(data));
        } catch (error) {
            res.writeHead(500, headers);
            res.end(JSON.stringify({ error: "Erreur lors de la recherche de films" }));
        }
        return;
    }
     

    // Route de test : Vérification de la disponibilité du service
    if (pathname === "/api/test" && req.method === "GET") { 
        res.writeHead(200, headers);
        res.end(JSON.stringify({ 
            status: "success", 
            message: "Service API CineVerse opérationnel",
            timestamp: new Date().toISOString()
        }));
        return;
    }

    
    //  * GESTION DES ERREURS 404
    //  * Exécutée si aucun chemin ne correspond aux routes définies
     
    res.writeHead(404, headers);
    res.end(JSON.stringify({ 
        error: "Ressource non trouvée",
        requestedPath: pathname 
    }));
});


//  * DÉMARRAGE DU SERVEUR
 
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`SERVEUR CINEVERSE : ACTIF`);
    console.log(`PORT : ${PORT}`);
    console.log(`URL DE TEST : http://localhost:${PORT}/api/test`);
    console.log(`===============================================`);
});