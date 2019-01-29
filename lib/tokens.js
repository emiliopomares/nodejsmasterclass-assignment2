'use strict';

const users = require('./users');
const storage = require('./objectstorage');
const operations = require('./operations');
const config = require('../config');
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
				var tokenId = helpers.generateRandomString(config.randomStringLength);
				var newToken = {
					TTL: 10,
					id: tokenId
				};
				storage.storeObject('tokens', tokenId, newToken, function(opRes) {
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

tokens.createToken('gatogordo@gmail.com', 'feedmemoar', function(opRes) {

});

module.exports = tokens;
