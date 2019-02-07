// Mailgun specific module

'use strict';

const config = require('../config');
const https = require('https');
const querystring = require('querystring');
const operations = require('./operations');

var mailgunHelper = {};

mailgunHelper.sendMail = function(orderdetails, callback) {

    operations.addContext('mailgunHelper.sendMail');

    var emailInfo = {};
    emailInfo.subject = "Your " + config.globals.StoreName + " order receipt";
    emailInfo.from = config.mailgunFromUser + "@" + config.mailgunDomain;
    emailInfo.to = orderdetails.clientemail;
    emailInfo.text = "This is an automatic receipt. Your order is as follows: \n" + JSON.stringify(orderdetails.ordereditems) + "\n\n Total: US$" + orderdetails.amount/10;
    var stringPayload = querystring.stringify(emailInfo);

    var requestInfo = {
        'protocol' : 'https:',
        'hostname' : 'api.mailgun.net',
        'method' : 'POST',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': stringPayload.length
          },
        'auth' : "api:"+config.mailgunToken,
        'path' : '/v3/' + config.mailgunDomain + "/messages",
        
    }

    var req = https.request(requestInfo, function(res) {

        var status = res.statusCode;

        /*res.setEncoding('utf8');
        res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
        });*/
        
        if(status == 200 || status == 201) {
            
            callback(operations.success(true, 'e-mail to '+orderdetails.clientemail+' enqueued successfully'));
        }
        else {
            callback(operations.error('e-mail sending error (' + status + ')'));
        }

    });

    req.on('error', function(e) {
        callback(operations.error(e))
    });

    req.write(stringPayload);

    req.end();


}

module.exports = mailgunHelper;