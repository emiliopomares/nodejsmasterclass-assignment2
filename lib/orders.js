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
                    var orderId = helpers.generateRandomString(4);
                    var newOrder = { client: receiptEmail,
                                     id: orderId,
                                     items: shoppingCart.itemList,
                                     status: 'preparing' };
                    
                    var orderFilename = orderId + '-' + log.getDateTime() + '-' + receiptEmail;
                    storage.storeObject('orders', orderFilename, newOrder, function(opRes) {
                        if(opRes.success == true) {
                            callback(operations.success(true, 'Payment complete and receipt enqueued successfully, order id: ' + orderId));
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

orders.update = function(orderId, newStatus, callback) {

}

orders.get = function(orderId, status, callback) {

}


module.exports = orders;
