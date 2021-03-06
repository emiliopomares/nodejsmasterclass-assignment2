'use strict';

const crypto = require('crypto');
const config = require('../config');

var passwordhash = {};

passwordhash.hash = function(str) {
	if(typeof(str) == 'string' && str.length > 0) {
                var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
                 return hash
        }
        else {
                return false
        }
}

module.exports = passwordhash;
