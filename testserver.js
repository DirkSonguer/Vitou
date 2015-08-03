
console.log("# Starting server");

// creating new http server
var http = require('http');
var fileSystem = require('fs');
var path = require('path');

// define request handler that will manage the incoming requests
function requestHandler(request, response) {
	console.log("# Calling request handler function with URL " + request.url);
    
    if (request.url == "/") {
        var filePath = path.join(__dirname, '/views/testclient.html');
        var stat = fileSystem.statSync(filePath);
    
        response.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': stat.size
        });
    
        var readStream = fileSystem.createReadStream(filePath);
        readStream.pipe(response);
    }	
}

// create server and define request / response function
http.createServer(requestHandler).listen(8887);

console.log("# Server is now listening");
