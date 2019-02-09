'use strict';

const helpers = require('./helpers');
const operations = require('./operations');
const storage = require('./objectstorage');
const menuhelper = require('./menuhelper');

// Reasonable: just one shopping cart per user at a time

var shoppingcart = {};

function ShoppingCart() {
	this.itemList = {};
	this.total = 0;
}

shoppingcart.calculateTotal = function(itemsDict) {
	var total = 0;
	var listOfItems = Object.values(itemsDict);
	for(var i = 0; i < listOfItems.length; ++i) {
		total += listOfItems[i].price * listOfItems[i].quantity;
	}
	return total;
}

var shoppingCarts = {};

shoppingcart.create = function(token, callback) {
	operations.addContext('shoppingcart.create');
	shoppingCarts[token] = new ShoppingCart();
	storage.storeObject('shoppingcarts', token, shoppingCarts[token], function(opRes) {
		if(opRes.success == true) {
			callback(operations.success(token, 'New shopping cart created for token ' + token));
		}
		else {
			callback(operations.error(opRes.data.info))
		}
	});
	
}

shoppingcart.destroy = function(token, callback) {
	operations.addContext('shoppingcart.destroy');
	storage.removeObject('shoppingcarts', token, function(opRes) {
		if(opRes.success == true) {
			callback(operations.success(true, 'Shopping cart destroyed successfully'));
		}
		else {
			callback(operations.error('Shopping cart for token ' + token + ' does not exist'));
		}
	})
	
}

shoppingcart.update = function(token, newItemListWithQuantities, callback) {
	operations.addContext('shoppingcart.update');
	var newCart = {itemList:{},total:0};
	var error = false;
	for(var i = 0; i < newItemListWithQuantities.length; ++i) {
		var opRes = menuhelper.getMenuItem(newItemListWithQuantities[i].item);
		if(opRes.success) {
			newCart.itemList[newItemListWithQuantities[i].item] = 
				{
					price: opRes.data.result.price,
					quantity: newItemListWithQuantities[i].quantity
				}
		}
		else {
			callback(operations.error('Item ' + newItemListWithQuantities[i] + ' is not on the menu'));
			error = true;
		}
	}
	if(!error) {
		newCart.total = shoppingcart.calculateTotal(newCart.itemList);
		storage.storeObject('shoppingcarts', token, newCart, function(opRes) {
			if(opRes.success == true) {
				callback(operations.success(newCart, 'Shopping cart updated successfully'));
			}
			else {
				callback(operations.error(opRes.data.info));
			}
		});
	}
	
}

shoppingcart.placeOrder = function(token, callback) {
	operations.addContext('shoppingcart.placeOrder');
	shoppingcart.destroy(token);
	callback(operations.success(true, 'Order placed successfully'));
}

shoppingcart.get = function(token, callback) {
	operations.addContext('shoppingcart.get');
	storage.retrieveObject('shoppingcarts', token, function(opRes) {
		if(opRes.success == true && opRes.data.result) {
			callback(operations.success(opRes.data.result, 'Shopping cart retrieved successfully'));
		}
		else if (opRes.success == true && !opRes.data.result) {
			callback(operations.error('No shopping cart for token ' + token));
		}
		else {
			callback(operations.error(opRes.data.info));
		}
	});
}

module.exports = shoppingcart;