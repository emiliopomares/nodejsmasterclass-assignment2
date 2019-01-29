/*
 * 
 * Root server file
 *
 */

'use strict';

const server = require('./lib/server.js');

var app = {};

app.go = function() {

	server.init();
	server.go();

}

app.go();

module.exports = app;
