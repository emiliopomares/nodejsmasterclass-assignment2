const operation = require('./operation');
const path = require('path');
const fs = require('fs');
const operations = require('./operations');

storage = {};

storage.baseDir = path.join(__dirname, "./../_data/");

storage.listObjects = function(typeOfObject, callback) {
	fs.readdir(storage.baseDir + typeOfObject + '/', function(err, data) {
		if(err) callback(operations.error('listObjects', 'I/O error: ' + err));
		if(data) {
			var trimmedFileNames = [];
			data.forEach(function(fileName)) {
				trimmedFileNames.push(fileName.replace('.json', ''));
			}
			callback(operations.success('listObjects', trimmedFileNames, 'Objects listed OK'));
		}
		else {
			callback(operations.error('listObjects', 'No data returned'));
		}
	}
}

storage.storeObject = function(typeOfObject, objectName, object, callback) {

}

storage.retrieveObject = function(typeOfObject, objectName, callback) {

}

module.exports = storage;
