console.log("node.js: %s", process.version);

var http = require('http');
var httpPort = 8080;
var httpMethod = "GET";

function getHttpsOptions(method, path) {
    return {
        headers: {
            'content-type': 'application/json',
        },
        method: method,
        host: "localhost",
        port: httpPort,
        path: path,
        //ey: config.connectorClient.key,
        //ert: config.connectorClient.cert,
        //a: config.connectorClient.ca,
        //assphrase: config.connectorClient.passphrase,
        //heckServerIdentity: function(servername, cert) {return false;} // we don't actually have a public server name
    };
}

function httpRequest(method, uri, data, callback) {
    var errorFunction = function(error, data) {
        if (callback) return callback(error, data)
        throw error;
        return false;
    }

    var successFunction = function(error, data) {
        if (callback) return callback(error, data)
        return true;
    }

    var handle = http.request(getHttpsOptions(method, uri), function(response) {
        httpHandler(response, function (error, data) {
            if (error) {
                return errorFunction(error);
            }

            return successFunction(error, data);
        });
    });

    handle.on('error', function(error){
        return errorFunction(error);
    });

    if (data) {
        handle.write(JSON.stringify(data));
    }
    handle.end();
}

function httpHandler(response, callback) {
    var data = '';

    response.on('data', function (chunk) {
        data += chunk;
    });

    response.on('end', function () {
        if (response.statusCode !== 200) {
            if (callback) return callback(new Error("unexpected HTTP response code"), data);

            return false;
        }

        if (callback) return callback(null, data);
        return true;
    });
};

function doRequest() {
    return httpRequest(httpMethod, '/', null, function (error, response) {
        if (error) {
            console.log("request failed");
            throw error;
        }

        console.log("request success");
        return;
    });
}

doRequest();
doRequest();
doRequest();
