'use strict';

const storage = require('./storage');
const operations = require('./operations')

users = {};


// Adds a new user object to the object storage and calls back the callback with an error (could be null)
users.createUser(name, email, address, password, callback) {

	storage.retrieveObject('users', email, function(operationResult) {

		// If storage access fails, return and error with reason of failure
		if(operationResult.success == false) callback(operations.error('createUser', operationResult.data.info));

		// If object already exists, return a 'User already exists' error
		else if(operationResult.success == true && operationResult.data.result == null) callback(operations.error('createUser', 'User already exists'));

		else {		
			const newUser = {
				name : name,
				email : email,
				streetAddress : address,
				password : password
			};
			storage.storeObject('users', email, newUser, function(operationResult) {

				// If storage access fails, return and error with reason of failure
				if(operationResult.success == false) callback(operations.error('createUser', operationResult.data.info));
				
				else callback(operations.success('createUser', true, 'New user created'));
			
			});
		}

	)}

}


users.validateCredentials(email, password, callback) {
	var storedUser = storage.retrieveObject('users', email, function(operationResult) {

		if(operationResult.success==false) callback(operations.error('validateCredentials', operationResult.data.info));

		if(operationResult.success==true && operationResult.data.result==null) callback(operation.success('validateCredentials', false, 'User does not exist');

		// user had been previously registered in storage
		else {

			var storedUser = operation.data.result;
			if(storedUser.password!==password) {
				callback(operation.success('validateCredentials', false, 'Wrong credentials'));
			}
			else callback(operation.success('validateCredentials', true, 'Credentials successfuly validated'));

		}
		
	});
}


module.exports = users;
