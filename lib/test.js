const eventhandler = require('./events');
const tokens = require('./tokens');
const shoppingcart = require('./shoppingcart');

eventhandler.setPolicy("tokens.delete", function(data) {
    shoppingcart.destroy(data);
});

tokens.createToken('gatogordo@gmail.com', 'feedmemoar', function(opRes) {
    var tokenId = opRes.data.result.id;
    shoppingcart.create(tokenId);
    shoppingcart.addItem(tokenId, 'Veggie Pizza');
    shoppingcart.get(tokenId);
    tokens.delete(tokenId, function(opRes) {
        if(opRes.success==true) {
            shoppingcart.get(tokenId);
        }
    })
});