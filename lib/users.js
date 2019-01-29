'use strict';

const storage = require('./objectstorage');
const operations = require('./operations')
const passwordhash = require('./passwordhash');

var users = {};


// Adds a new user object to the object storage and calls back the callback with an error (could be null)
users.createUser = function(name, email, address, password, callback) {

	operations.addContext('createUser');
	storage.retrieveObject('users', email, function(operationResult) {

		// If storage access fails, return and error with reason of failure
		if(operationResult.success == false) callback(operations.error(operationResult.data.info));

		// If object already exists, return a 'User already exists' error
		else if(operationResult.success == true && operationResult.data.result !== null) callback(operations.error('User already exists'));

		else {		
			const newUser = {
				name : name,
				email : email,
				streetAddress : address,
				password : passwordhash.hash(password)
			};
			storage.storeObject('users', email, newUser, function(operationResult) {

				// If storage access fails, return and error with reason of failure
				if(operationResult.success == false) callback(operations.error(operationResult.data.info));
				
				else callback(operations.success(true, 'New user created'));
			
			});
		}

	});

}


users.validateCredentials = function(email, password, callback) {

	operations.addContext('validateCredentials');
	var storedUser = storage.retrieveObject('users', email, function(operationResult) {

		if(operationResult.success==false) callback(operations.error(operationResult.data.info));

		if(operationResult.success==true && operationResult.data.result==null) callback(operation.success(false, 'User does not exist'));

		// user had been previously registered in storage
		else {

			var storedUser = operationResult.data.result;
			if(storedUser.password!==passwordhash.hash(password)) {
				callback(operations.success(false, 'Wrong credentials'));
			}
			else callback(operations.success(true, 'Credentials successfuly validated'));

		}
		
	});
}


module.exports = users;
