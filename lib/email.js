const operations = require('./operations')
const mailgunHelper = require('./mailgunHelper')

var email = {};

email.send = function(orderdetails, callback) {
    mailgunHelper.sendMail(orderdetails, callback);
}


email.send({amount:240,clientemail:'emilio.pomares.porras@gmail.com',ordereditems:[
    "Pizza Margarita", "Veggie Pizza"
    ]}, function(opRes) {

})

module.exports = email;