'use strict';

var helpers = {};

helpers.generateRandomString = function(length) {
 	length = typeof(length)=='number' && length > 0 ? length : false
        if(length) {
                var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789'
                var str = ''

                for(var i = 1; i <= length; i++) {
                        var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
                        str += randomCharacter
                }

                return str

        }
        else {
                return false
        }
}

helpers.parseJsonToObject = function(str) {
        try {
                var obj = JSON.parse(str);
        }
        catch(e) {
                return {}
        }
        return obj
}

// @TODO: check types, do not assume 'string'
// example: getRequestData(data, {queryStringFields:[{fieldName:'name'}, {fieldName:'age'}]})
helpers.retrieveRequestData = function(data, fields) {
        var result = {};
        var queryStringFields = fields.queryStringFields;
        var payloadFields = fields.payloadFields;
        var headerFields = fields.headerFields;
       
	if(headerFields !== undefined) {
		for(var i = 0; i < headerFields.length; ++i) {
                        var _id = headerFields[i].fieldName;
                        
                        if(typeof(data.headers[_id]) !== headerFields[i].type) {
                                if(headerFields[i].optional == undefined || headerFields[i].optional == false) {
                                        return false;
                                }
                        }
                        else {
                                result[_id] = data.headers[_id];
                        }
		}
	}
	if(queryStringFields !== undefined) {
                for(var i = 0; i < queryStringFields.length; ++i) {
                        var _id = queryStringFields[i].fieldName;

                        if(typeof(data.queryStringObject[_id]) !== queryStringFields[i].type) {
                                if(queryStringFields[i].optional == undefined || queryStringFields[i].optional == false) {
                                        return false;
                                }
                        }
                        else {
                                result[_id] = data.queryStringObject[_id];
                        }

                }
        }       
        if(payloadFields !== undefined) {       
                for(var i = 0; i < payloadFields.length; ++i) {
                        var _id = payloadFields[i].fieldName;
                        if(typeof(data.payload[_id]) !== payloadFields[i].type) {
                                if(payloadFields[i].optional == undefined || payloadFields[i].optional == false) {
                                        return false;
                                }
                        }
                        else {
                                result[_id] = data.payload[_id];
                        }

                }
        }
        return result;
}

module.exports = helpers;
