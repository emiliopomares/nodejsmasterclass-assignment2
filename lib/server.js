'use strict';

const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('../config');
const handlers = require('./handlers');
const helpers = require('./helpers')
const path = require('path');
const fs = require('fs');

const server = {};



server.serverFunction = function(req, res) {

    var parsedURL = url.parse(req.url, true);

    var path = parsedURL.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    var queryStringObject = parsedURL.query;

    var components = trimmedPath.split('/');

    var method = req.method.toLowerCase();

    var headers = req.headers;

    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });

    req.on('end', function() {
        buffer += decoder.end();

        if(trimmedPath == "favicon.ico") {
            res.setHeader('Content-Type', 'image/x-icon');
            res.writeHead(200);
            res.end(handlers.faviconData);
        }

        else {
            var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
            var data = {
                'trimmedPath' : trimmedPath,
                'queryStringObject' : queryStringObject,
                'method' : method,
                'headers' : headers,
                'payload' : helpers.parseJsonToObject(buffer) 
            };

            chosenHandler(data, function(statusCode, payload) {
                console.log("  >>>> chosen handler called callback with:");
                console.dir(statusCode);
                console.dir(payload);
                statusCode = typeof(statusCode) == 'number' ? statusCode : 200
                        payload = typeof(payload) == 'object' ? payload : {}
                        var payloadString = JSON.stringify(payload);
                        res.setHeader('Content-Type', 'application/json');
                        res.writeHead(statusCode);
                        res.end(payloadString);
            });
        }

    })

}

server.init = function() {
    server.credentials = {
        cert: fs.readFileSync(path.join(__dirname,'../ssl/cert.pem')),
        key: fs.readFileSync(path.join(__dirname,'../ssl/key.pem'))
    };
    server.httpServer = http.createServer(server.serverFunction);
    server.httpsServer = https.createServer(server.credentials, server.serverFunction);
}

server.go = function() {
        server.httpServer.listen(config.httpPort, function() {

                console.log('http server started on port ' + config.httpPort + ' in ' + config.envName + ' mode')

        })
        server.httpsServer.listen(config.httpsPort, function() {

                console.log('https server started on port ' + config.httpsPort + ' in ' + config.envName + ' mode')

        })
}

server.router = {
    'test' : handlers.test,
    //'ping': handlers.ping,
    'users': handlers.users,
    //'orders': handlers.orders,
    'tokens' : handlers.tokens
}

module.exports = server