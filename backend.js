require('dotenv').config();
const http = require('http');
const url = require('url');
const mysql = require('mysql2');

// 1. Connexion à MySQL
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
    console.log('Connecté à la base de données MySQL !');
});

// 2. Outils TMDB
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// 3. Fonction utilitaire pour lire les données POST (JSON)
function getPostData(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try { 
                resolve(JSON.parse(body)); 
            } catch (e) { 
                resolve({}); 
            }
        });
    });
}

// 4. Création du Serveur
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    // On nettoie l'adresse (on enlève les slashs inutiles à la fin)
    const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';
    const queryData = parsedUrl.query;

    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    // Gestion du Preflight CORS
    if (req.method === "OPTIONS") {
        res.writeHead(204, headers);
        res.end();
        return;
    }

    console.log(`[LOG] ${req.method} ${pathname}`);

    // --- ROUTE : TRENDING ---
    if (pathname === "/api/trending" && req.method === "GET") {
        try {
            const page = queryData.page || 1;
            const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=fr-FR&page=${page}`);
            const data = await response.json();
            res.writeHead(200, headers);
            res.end(JSON.stringify(data));
        } catch (error) {
            res.writeHead(500, headers);
            res.end(JSON.stringify({ error: "Erreur TMDB" }));
        }
        return;
    }

    // --- ROUTE : SEARCH ---
    if (pathname === "/api/search" && req.method === "GET") {
        try {
            const searchTerm = queryData.q;
            const page = queryData.page || 1;
            if (!searchTerm) {
                res.writeHead(400, headers);
                res.end(JSON.stringify({ error: "Recherche vide" }));
                return;
            }
            const response = await fetch(`${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(searchTerm)}&page=${page}`);
            const data = await response.json();
            res.writeHead(200, headers);
            res.end(JSON.stringify(data));
        } catch (error) {
            res.writeHead(500, headers);
            res.end(JSON.stringify({ error: "Erreur recherche" }));
        }
        return;
    }

    // --- ROUTE : REGISTER (S'INSCRIRE) ---
    if (pathname === "/api/register" && req.method === "POST") {
        const body = await getPostData(req);
        const { username, email, password } = body;

        const checkSql = "SELECT * FROM users WHERE email = ?";
        db.query(checkSql, [email], (err, result) => {
            if (err) {
                res.writeHead(500, headers);
                return res.end(JSON.stringify({ message: "Erreur serveur" }));
            }
            if (result.length > 0) {
                res.writeHead(400, headers);
                return res.end(JSON.stringify({ message: "Cet email est déjà utilisé !" }));
            }

            // Correction : Utilisation de 'nom' pour correspondre à ta table MySQL
            const sql = "INSERT INTO users (nom, email, password) VALUES (?, ?, ?)";
            db.query(sql, [username, email, password], (err, insertResult) => {
                if (err) {
                    console.error("Erreur MySQL complète :", err);
                    res.writeHead(500, headers);
                    return res.end(JSON.stringify({ message: "Erreur lors de l'insertion : " + err.sqlMessage }));
                }
                res.writeHead(201, headers);
                res.end(JSON.stringify({ message: "Utilisateur créé avec succès !" }));
            });
        });
        return;
    }

    // --- ROUTE : LOGIN (SE CONNECTER) ---
    if (pathname === "/api/login" && req.method === "POST") {
        const body = await getPostData(req);
        const { email, password } = body;

        const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
        db.query(sql, [email, password], (err, result) => {
            if (err) {
                res.writeHead(500, headers);
                return res.end(JSON.stringify({ message: "Erreur serveur" }));
            }

            if (result.length > 0) {
                res.writeHead(200, headers);
                res.end(JSON.stringify({ 
                    message: "Connexion réussie !", 
                    user: result[0].nom // Changé 'username' en 'nom' ici aussi
                }));
            } else {
                res.writeHead(401, headers);
                res.end(JSON.stringify({ message: "Email ou mot de passe incorrect." }));
            }
        });
        return;
    }

    // --- ROUTE TEST ---
    if (pathname === "/api/test" && req.method === "GET") {
        res.writeHead(200, headers);
        res.end(JSON.stringify({ message: "Serveur CineVerse opérationnel !" }));
        return;
    }

    // --- 404 PAR DÉFAUT ---
    res.writeHead(404, headers);
    res.end(JSON.stringify({ error: "Route non trouvée", path: pathname }));
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Serveur prêt sur http://localhost:${PORT}`);
});