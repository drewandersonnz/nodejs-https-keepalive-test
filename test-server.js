console.log("node.js: %s", process.version);

var http = require('http');
var httpPort = 80;
var httpMethod = "GET";

function onSocketClose() {
    console.log('###### disconnected socket close');
}

var server = http.createServer(function (request, response) {
    console.log(request.method + " " + request.url);

    response.socket.removeListener('close', onSocketClose);
    response.socket.on('close', onSocketClose);

    if (request.method == httpMethod) {
        request.on('data', function(chunk) {
            //console.log(chunk.toString());
        });

        request.on('end', function() {
            console.log("server connections: " + server._connections);
            response.writeHead(200, {
                "Content-Type": "application/json",
                "Connection": "keep-alive",
            });
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
