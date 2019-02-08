'use strict';

const storage = require('./objectstorage');
const operations = require('./operations')
const passwordhash = require('./passwordhash');

var users = {};


// Adds a new user object to the object storage and calls back the callback with an error (could be null)
users.create = function(name, email, address, password, callback) {

	operations.addContext('users.createUser');
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

users.update = function(oldEmail, newName, newEmail, newAddress, newPassword, callback) {

	operations.addContext('users.updateUser');
	storage.retrieveObject('users', oldEmail, function(operationResult) {

		// If storage access fails, return and error with reason of failure
		if(operationResult.success == false) callback(operations.error(operationResult.data.info));

		// If object already exists, return a 'User already exists' error
		else if(operationResult.success == true && operationResult.data.result == null) callback(operations.error('User does not exist'));

		else {		
			var existingUser = operationResult.data.result;

			if(newName) existingUser.name = newName;
			if(newAddress) existingUser.address = newAddress;
			if(newPassword) existingUser.password = passwordhash.hash(newPassword);
			
			storage.storeObject('users', oldEmail, existingUser, function(operationResult) {

				// If storage access fails, return and error with reason of failure
				if(operationResult.success == false) callback(operations.error(operationResult.data.info));
				
				else callback(operations.success(existingUser, 'User updated'));
			
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

users.delete = function(email, callback) {
	
	operations.addContext('users.delete');
	storage.removeObject('users', email, function(opRes) {
		if(opRes.success == true) {
			callback(operations.success(true, 'User deleted successfully'));
		}
		else {
			callback(operations.error('Could not delete user: ' + opRes.data.info));
		}
	})
}

module.exports = users;
