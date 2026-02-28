// On appel le module natif http qui prendra en charge ce que le front reçoit et ce qu'il envoit au backend
    const { on } = require('cluster');
const http = require('http');

 // il est utilisé afin d'analyser les requêtes plus facilement
    const url = require('url'); 
    
    // pour stocker les favories
    let favorites = [];

//  Crétion de mon server Javascript
    const server = http.createServer ((req ,res) => {   

    // Analyse de l'URL qui arrive
    const parsedUrl = url.parse(req.url, true);
    

    // extraire le chemin d'accès
    const pathname = parsedUrl.pathname ;
    

    //extraire les paramètres de la requête
    const queryData = parsedUrl.query;


    console.log("Quelqu'un appelle le chemin :", pathname);
    
    console.log("Avec ces paramètres :", queryData);

    
    if (pathname === "/api/test" && req.method === "GET") // verifie l'addresse et recupère des infos
    
{ 
    res.writeHead ( 200,{  "Content-Type":"application/json" }); // code succès données en Json

   
    res.end(JSON.stringify ({ message: " API fonctionne"})); // envoi la données et ferme la connexion
    return
    }

    // ici tout sur les favories

    // obtenir des favoris

    if (pathname === "/api/favorites") 
        {
            if (req.method === "GET")
                {
                    res.writeHead (200,{"Content-Type":"application/json"} )
                    res.end (JSON.stringify(favorites))
                    return
                }
    

    // envoie les données des favoris dans le corps
    
            if (req.method === "POST")
                {
                    let body = "";
                    req.on("data",chunk =>
                        { 
                            body += chunk.toString();   // envoie un Post et les données arrive en chunks   chunks veut dir morceau
                        });
        
                    req.on("end",() => 
                        {
                            const newFavorite = JSON.parse(body);   //la toutes les donnés sont recus
                            favorites.push(newFavorite);

                            res.writeHead (201,{ "Content-Type":"application/json"})
                            res.end(JSON.stringify({message:"ajouté au favoris"}))
                            
                        })
                }return;
            }

        // suprimer les favoris
if (pathname.startsWith("/api/favorites/") && req.method === "DELETE") 
        {
            const id =pathname.split("/") [3];
            favorites = favorites.filter( fav => fav.id !=id );
    
            console.log("Tentative de suppression de l'ID :", id);

            res.writeHead (200, {"Content-Type":"application/json"})
            res.end (JSON.stringify({message:"Supprimé"}))
            return;
        } 
        
    // Pour ne pas que mon navigateur tourne dans le vide 
    
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route non trouvée" }));
    
});
    
    // Ecoute du serveur sur le port 3000
server.listen(3000, () => {
    console.log("Le serveur est lancé sur le port 3000 de http://localhost:3000");
});



