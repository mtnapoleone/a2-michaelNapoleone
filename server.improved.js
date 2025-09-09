const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

const appdata = [
  { "model": "toyota", "year": 1999, "mpg": 23 },
  { "model": "honda", "year": 2004, "mpg": 30 },
  { "model": "ford", "year": 1987, "mpg": 14} 
]

const server = http.createServer(function(request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  } else if (request.method === "PUT") {
    handlePut(request, response);
  }
});


const handleGet = function(request, response) {
  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/results") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(appdata));
  } else {
    const filename = dir + request.url.slice(1);
    sendFile(response, filename);
  }
};

const handlePost = function(request, response) {
  let dataString = "";

  request.on("data", function(data) {
    dataString += data;
  });

  request.on("end", function() {
    const newEntry = JSON.parse(dataString);
    newEntry.age = new Date().getFullYear() - newEntry.year;
    appdata.push(newEntry);

    response.writeHead(200, "OK", { "Content-Type": "application/json" });
    response.end(JSON.stringify(appdata));
  });
};
const handlePut = function(request, response) {
  let dataString = "";

  request.on("data", function(data) {
    dataString += data;
  });

  request.on("end", function() {
    const updatedEntry = JSON.parse(dataString);
    const index = appdata.findIndex(car => car.model === updatedEntry.model);

    if (index !== -1) {
      updatedEntry.age = new Date().getFullYear() - updatedEntry.year;
      appdata[index] = updatedEntry;

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(appdata));
    } else {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Car not found");
    }
  });
};
const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we"ve loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { "Content-Type": type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( "404 Error: File Not Found" )

     }
   })
}


server.listen( process.env.PORT || port )
//https://www.geeksforgeeks.org/node-js/build-a-simple-static-file-web-server-in-node-js/
