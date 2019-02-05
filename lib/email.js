const operations = require('./operations')
const mailgunHelper = require('./mailgunHelper')

email = {};

email.send = function(recipient, body, subject, callback) {
    mailgunHelper(recipient, body, subject, callback);
}

module.exports = email;