'use strict';

const users = require('./users');
const storage = require('./objectstorage');
const operations = require('./operations');
const config = require('../config');
const helpers = require('./helpers');
const eventmanager = require('./events');

var tokens = {};

tokens.create = function(user, userPassword, callback) {
	operations.addContext('tokens.create');
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
					email: user,
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

tokens.check = function(tokenId, callback) {
	operations.addContext('tokens.check');
	storage.retrieveObject('tokens', tokenId, function(opRes) {
		if(opRes.success) {
			callback(operations.success(opRes.data.result, 'Token valid'));
		}
		else {
			callback(operations.error('Token not valid'));
		}
	});
}

tokens.delete = function(tokenId, callback) {
	operations.addContext('tokens.delete');
	storage.removeObject('tokens', tokenId, function(opRes) {
			if(opRes.success == true) {
				//eventhandler.fireEvent('tokens.delete', tokenId);
				callback(operations.success(true, 'Token ' + tokenId + ' deleted successfully'));
			}
			else {
				callback(operations.error(opRes.data.info));
			}
	});
}



module.exports = tokens;
