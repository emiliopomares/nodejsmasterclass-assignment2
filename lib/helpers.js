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

module.exports = helpers;
