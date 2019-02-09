// Stripe Specific module

'use strict';

const config = require('../config');
const https = require('https');
const querystring = require('querystring');
const operations = require('./operations');

var stripeHelper = {};

stripeHelper.processPayment = function(orderdetails, callback) {

    operations.addContext('stripeHelper.processPayment');

    var paymentDetails = {};
    paymentDetails.currency = "USD";
    paymentDetails.source = "tok_visa";
    paymentDetails.amount = Math.round(orderdetails.amount);
    paymentDetails.description = orderdetails.description;
    var stringPayload = querystring.stringify(paymentDetails);

    var requestInfo = {
        'protocol' : 'https:',
        'hostname' : 'api.stripe.com',
        'method' : 'POST',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': stringPayload.length
          },
        'auth' : config.stripeToken.secret+":",
        'path' : '/v1/charges'
    }

    var req = https.request(requestInfo, function(res) {

        var status = res.statusCode;
        
        if(status == 200 || status == 201) {
            
            callback(operations.success(true, 'Payment of US$'+orderdetails.amount/10+' completed successfully'));
        }
        else {
            callback(operations.error('Payment did not complete successfully'));
        }

    });

    req.on('error', function(e) {
        callback(operations.error(e))
    });

    req.write(stringPayload);

    req.end();

}

module.exports = stripeHelper;
