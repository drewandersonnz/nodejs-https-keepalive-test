console.log("node.js: %s", process.version);

var http = require('http');
var httpPort = 8080;
var httpMethod = "GET";

var server = http.createServer(function (request, response) {
    console.log();
    console.log(request.url);

    if (request.method == httpMethod) {
        request.on('data', function(chunk) {
            console.log(chunk.toString());
        });

        request.on('end', function() {
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end();
        });
    }

    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify({
        status:"ok",
    }));
});

server.listen(httpPort);

console.log("Server running at http://127.0.0.1:%d/", httpPort);
