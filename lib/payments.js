const operations = require('./operations');
const stripeHelper = require('./stripeHelper');

var payments = {};

payments.processPayment = function(orderdetails, callback) {
    stripeHelper.processPayment(orderdetails, callback);
}

//payments.processPayment({amount:125,description:'Order for a@b.com at 12:31:21',clientemail:'a@b.com'}, function(opRes) {

//});

module.exports = payments;