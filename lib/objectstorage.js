'use strict';

const path = require('path');
const fs = require('fs');
const operations = require('./operations');

var storage = {};

storage.baseDir = path.join(__dirname, "./../_data/");

storage.listObjects = function(typeOfObject, callback) {
	operations.addContext('listObjects');
	fs.readdir(storage.baseDir + typeOfObject + '/', function(err, data) {
		if(err) callback(operations.error('I/O error: ' + err));
		if(data) {
			var trimmedFileNames = [];
			data.forEach(function(fileName) {
				trimmedFileNames.push(fileName.replace('.json', ''));
			})
			callback(operations.success(trimmedFileNames, 'Objects listed OK'));
		}
		else {
			callback(operations.error('No data returned'));
		}
	})
}

storage.storeObject = function(typeOfObject, objectName, object, callback) {
	operations.addContext('storeObject');
	fs.open(storage.baseDir + typeOfObject + '/' + objectName + '.json', 'w', function(err, fileDescriptor) {
		if(err) callback(operations.error('I/O error: ' + err));
		else if(fileDescriptor) {
			var stringObject = JSON.stringify(object);
			fs.writeFile(fileDescriptor, stringObject, function(err) {
				if(err) callback(operations.error('I/O error: ' + err));
				else {
					fs.close(fileDescriptor, function(err) {
						if(err) callback(operations.error('I/O error: could not close file'));
						else callback(operations.success(true, 'Object successfully stored'));
					})
				}
			})
		}
		else {
			callback(operations.error('I/O error: no file descriptor obtained'));
		}
	})
}

storage.retrieveObject = function(typeOfObject, objectName, callback) {
	operations.addContext('retrieveObject');
	fs.readFile(storage.baseDir + typeOfObject + '/' + objectName + '.json', 'utf8', function(err, data) {
		if(err) {
			var errorString = "" + err;
			if(errorString.indexOf("no such file")!=-1) callback(operations.success(null, 'Object does not exist')); 
			else callback(operations.error('I/O ... error: ' + err));
		}
		else if (data) {
			var parsedData = JSON.parse(data);
			callback(operations.success(parsedData, 'Object successfully retrieved'));
		}
		else {
			callback(operations.success(null, 'Object not found'));
		}
	})
}


module.exports = storage;
