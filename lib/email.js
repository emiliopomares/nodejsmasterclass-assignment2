const operations = require('./operations')
const mailgunHelper = require('./mailgunHelper')

var email = {};

email.send = function(orderdetails, callback) {
    mailgunHelper.sendMail(orderdetails, callback);
}




module.exports = email;