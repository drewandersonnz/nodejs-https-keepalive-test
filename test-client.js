console.log("node.js: %s", process.version);

var http = require('http');
var httpPort = 80;
var httpMethod = "GET";

var httpsAgent = new http.Agent({
    keepAlive: true,
    maxSockets: 1,
});

function getHttpsOptions(method, path) {
    return {
        agent: httpsAgent,
        headers: {
            'Content-Type': 'application/json',
        },
        method: method,
        host: "localhost",
        port: httpPort,
        path: path,
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

function doRequest(uri, callback) {
    return httpRequest(httpMethod, uri, null, function (error, response) {
        if (error) {
            console.log("request failed");
        } else {
            console.log("request success");
        }

        if (callback) return callback(error, response);
        return;
    });
}

doRequest('/1', function () {
    doRequest('/2');
});
doRequest('/3');

doRequest('/4', function () {
    doRequest('/5');
});
doRequest('/6');

doRequest('/7', function () {
    doRequest('/8');
});
doRequest('/9');

setTimeout(function() {
    console.log('timeout');
}, 2500);
