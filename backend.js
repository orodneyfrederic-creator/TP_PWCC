//Connexion à MySql

const mysql = require('mysql2');

// On crée la connexion à WampServer (par défaut l'utilisateur est 'root' sans mot de passe)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'cineverse_db'
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à MySQL :', err);
        return;
    }
    console.log('Connecté à la base de données MySQL de WampServer !');
});



// On charge les outils pour lire le fichier caché ".env" (là on caches ta clé secrète TMDB)
require('dotenv').config();

// On récupère ta clé API personnelle et l'adresse de base du site TMDB
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// On importe les outils de base de Node.js pour créer un serveur et lire les adresses web
const http = require('http'); 
const url = require('url');   

//  CRÉATION DU SERVEUR 
// C'est ici qu'on crée la "machine" qui va répondre aux demandes du site
const server = http.createServer(async (req, res) => {
    
    // On analyse l'adresse que le navigateur a demandée
    const parsedUrl = url.parse(req.url, true);
    
    // On nettoie l'adresse (on enlève les slashs inutiles à la fin)
    const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';
    
    // On récupère les options après le "?" dans l'adresse (comme le numéro de page ou le nom d'un film)
    const queryData = parsedUrl.query;

    // --- RÉGLAGES DE SÉCURITÉ (CORS) ---
    // Ces lignes disent au navigateur : "C'est bon, j'autorise mon site à me demander des infos"
    const headers = {
        "Content-Type": "application/json", // On répond toujours en format JSON (texte organisé)
        "Access-Control-Allow-Origin": "*", // On autorise tout le monde à appeler l'API
        "Access-Control-Allow-Methods": "GET, OPTIONS", // On n'autorise que la lecture
        "Access-Control-Allow-Headers": "Content-Type"
    };

    // Si le navigateur fait une petite vérification de routine (OPTIONS), on lui répond "OK" direct
    if (req.method === "OPTIONS") {
        res.writeHead(204, headers);
        res.end();
        return;
    }

    // On affiche dans le terminal noir ce que le navigateur demande (pratique pour débugger)
    console.log(`[LOG] Le site demande : ${req.method} ${pathname}`);

    // --- LE TRI DES DEMANDES (ROUTAGE) ---

    // Route 1 : Récupérer les films à l'affiche (pour l'accueil et le scroll infini)
    if (pathname === "/api/trending" && req.method === "GET") {
        try {
            // On regarde quelle page on nous demande (par défaut la 1)
            const page = queryData.page || 1; 
            // On va chercher les films "tendances" de la semaine sur TMDB avec ta clé
            const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=fr-FR&page=${page}`);
            const data = await response.json();
            
            // On renvoie la liste des films à ton fichier Javascript.js
            res.writeHead(200, headers);
            res.end(JSON.stringify(data));
        } catch (error) {
            // Si la connexion avec TMDB plante, on prévient le site
            res.writeHead(500, headers);
            res.end(JSON.stringify({ error: "Oups, le serveur a eu un petit problème." }));
        }
        return;
    }

    // Route 2 : Chercher un film précis par son nom
    if (pathname === "/api/search" && req.method === "GET") {
        try {
            const searchTerm = queryData.q; // On récupère le texte tapé dans la barre de recherche
            const page = queryData.page || 1;

            // Si l'utilisateur n'a rien tapé, on s'arrête là
            if (!searchTerm) {
                res.writeHead(400, headers);
                res.end(JSON.stringify({ error: "Tu n'as rien écrit dans la recherche !" }));
                return;
            }

            // On demande à TMDB de chercher les films qui correspondent au texte
            const response = await fetch(`${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(searchTerm)}&page=${page}`);
            const data = await response.json();

            res.writeHead(200, headers);
            res.end(JSON.stringify(data));
        } catch (error) {
            res.writeHead(500, headers);
            res.end(JSON.stringify({ error: "La recherche a échoué cette fois-ci." }));
        }
        return;
    }

    // Route de test : Juste pour voir si le serveur est bien allumé
    if (pathname === "/api/test" && req.method === "GET") { 
        res.writeHead(200, headers);
        res.end(JSON.stringify({ 
            status: "success", 
            message: "Le serveur CineVerse répond parfaitement !",
            timestamp: new Date().toISOString()
        }));
        return;
    }

    // --- ERREUR 404 ---
    // Si le site demande une adresse qui n'existe pas (ex: /api/pizza)
    res.writeHead(404, headers);
    res.end(JSON.stringify({ 
        error: "Cette page d'API n'existe pas.",
        requestedPath: pathname 
    }));
});

// --- LANCEMENT ---
// On dit au serveur d'écouter sur le port 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`TON SERVEUR EST PRÊT !`);
    console.log(`Il tourne sur : http://localhost:${PORT}`);
    console.log(`Tu peux tester ici : http://localhost:${PORT}/api/test`);
    console.log(`===============================================`);
});