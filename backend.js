// On appel le module natif http qui prendra en charge ce que le front reçoit et ce qu'il envoit au backend
    const http = require('http');

 // il est utilisé afin d'analyser les requêtes plus facilement
    const url = require('url'); 


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
    res.writeHead ( 200,{  "content-Type": "application/json" }); // code succès données en Json

    res.end(JSON.stringify ({ message: " API fonctionne"})); // envoi la données et ferme la connexion

    return;
}

    // Pour ne pas que mon navigateur tourne dans le vide 
    
    res.end ("Bien reçu !");
});
    
    // Ecoute du serveur sur le port 3000
server.listen(3000, () => {
    console.log("Le serveur est lancé sur le port 3000 de http://localhost:3000");
});



