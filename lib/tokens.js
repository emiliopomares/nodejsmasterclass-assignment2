'use strict';

const users = require('./users');
const storage = require('./objectstorage');
const operations = require('./operations');
const helpers = require('./helpers');

var tokens = {};

tokens.createToken = function(user, userPassword, callback) {
	operations.addContext('createToken');
	users.validateCredentials(user, userPassword, function(opRes) {
		if(opRes.success == false) {
			callback(operations.error(opRes.data.info));
		}
		else {
			if(opRes.data.result == false) {
				callback(operations.error('Invalid credentials'));
			}
			else {
				var tokenId = helpers.generateRandomString();
				var newToken = {
					TTL: 10,
					id: tokenId
				};
				storage.storeObject('tokens', tokenId, function(opRes) {
					if(opRes.success == false) {
						callback(operations.error(opRes.data.info));
					}
					else {
						callback(operations.success(newToken, 'Token successfully created'));
					}
				}); 
			}
		}
	});
}

tokens.delete = function(tokenId, callback) {

}

module.exports = tokens;
