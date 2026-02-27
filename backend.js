// On appel le module natif http qui prendra en charge ce que le front reçoit et ce qu'il envoit au backend
const http = require('http');

 // il est utilisé afin d'analyser les requêtes plus facilement
 const url = require('url'); 


//  Crétion de mon server Javascript
const server = http.createServer ((res,req) => {

    // Analyse de l'URL qui arrive
    const parsedUrl = url.parsed(req.url, true)
    

    // extraire le chemin d'accès
    const parthName = (parsedUrl.parthName)
    
})