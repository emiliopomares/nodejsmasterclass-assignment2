'use strict';

const storage = require('./objectstorage');
const operations = require('./operations');
const config = require('../config');
const email = require('./email');
const payments = require('./payments');
const helpers = require('./helpers');
const log = require('./log');

var orders = {};

orders.place = function(shoppingCart, creditCardNumber, cvc, receiptEmail, callback) {

    operations.addContext("orders.place");

    var orderDescription = 'Order for ' + receiptEmail + ' (' + log.getDateTime() + ')';
    var amountToCharge = shoppingCart.total * 10;
    payments.processPayment({amount:amountToCharge,description:orderDescription,clientemail:receiptEmail}, function(opRes) {
        if(opRes.success == true) {
            email.send({amount:amountToCharge,clientemail:receiptEmail,ordereditems:shoppingCart}, function(opRes) {
                if(opRes.success == true) {
                    var newOrder = { client: receiptEmail,
                                     items: shoppingCart.itemList,
                                     status: 'preparing' };
                    var orderId = helpers.generateRandomString(4) + log.getDateTime() + receiptEmail;
                    storage.storeObject('orders', orderId, newOrder, function(opRes) {
                        if(opRes.success == true) {
                            callback(operations.success(true, 'Payment complete and receipt enqueued successfully'));
                        }
                        else {
                            callback(operations.error('Payment complete and receipt enqueued successfully BUT: ' + opRes.data.info));
                        }
                    });
                    
                }
                else {
                    callback(operations.error(opRes.data.info));
                }
            })
        }
        else {
            callback(operations.error(opRes.data.info))
        }
    });
};

module.exports = orders;
