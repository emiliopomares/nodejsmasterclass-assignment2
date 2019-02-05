const operations = require('./operations');
const stripeHelper = require('./stripeHelper');

var payments = {};

payments.processPayment = function(orderdetails, callback) {
    stripeHelper.processPayment(orderdetails, callback);
}

payments.processPayment({amount:125,description:'Orderfora@b.comat12:31:21'}, function(opRes) {

});

module.exports = payments;