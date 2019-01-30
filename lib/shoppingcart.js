'use strict';

const helpers = require('./helpers');
const operations = require('./operations');
const menuhelper = require('./menuhelper');

// Reasonable: just one shopping cart per user at a time

var shoppingcart = {};

function ShoppingCart() {
	this.itemList = {};
	this.total = 0;
}

ShoppingCart.prototype.calculateTotal = function() {
	var listOfItems = Object.values(this.itemList);
	var total = 0;
	for(var i = 0; i < listOfItems.length; ++i) {
		total += listOfItems[i].price * listOfItems[i].quantity;
	}
	this.total = total;
}






var shoppingCarts = {};

shoppingcart.create = function(token) {
	operations.addContext('shoppingcart.create');
	shoppingCarts[token] = new ShoppingCart();
	return operations.success(token, 'New shopping cart created for token ' + token);
}

shoppingcart.destroy = function(token) {
	operations.addContext('shoppingcart.destroy');
	if(shoppingCarts[token] == undefined) {
		return operations.error('Shopping cart for token ' + token + ' does not exist');
	}
	else {
		delete shoppingCarts[token];
		return operations.success(true, 'Shopping cart destroyed successfully');
	}
}

shoppingcart.addItem = function(token, itemId) {
	operations.addContext('shoppingcart.addItem');
	var opRes = menuhelper.getMenuItem(itemId);
	if(opRes.success == false) {
		return operations.error('Item ' + itemId + ' not found in menu');
	}
	var menuItem = opRes.data.result;
	if(shoppingCarts[token] == undefined) {
		return operations.error('Shopping cart for token ' + token + ' does not exist');
	}
	if(shoppingCarts[token].itemList[itemId] == undefined) {
		shoppingCarts[token].itemList[itemId] = {
			price : menuItem.price,
			quantity: 1
		};
	}
	else {
		shoppingCarts[token].itemList[itemId].quantity++;
	}
	shoppingCarts[token].calculateTotal();
	return operations.success(true, 'Quantity updated successfully');
}

shoppingcart.removeItem = function(token, itemId) {
	operations.addContext('shoppingcart.removeItem');
	if(shoppingCarts[token]==undefined) {
		return operations.error('Shopping cart for token ' + token + ' does not exist');
	}
	if((shoppingCarts[token].itemList[itemId] !== undefined) &&
		(shoppingCarts[token].itemList[itemId].quantity > 0)) {
			shoppingCarts[token].itemList[itemId].quantity--;
			shoppingCarts[token].calculateTotal();
			return operations.success(true, 'Quantity updated successfully');
	}
	else {
		return operations.error('Cannot remove: item '+itemId+' amount not greater than zero');
	}
}

shoppingcart.placeOrder = function(token, callback) {
	operations.addContext('shoppingcart.placeOrder');
	shoppingcart.destroy(token);
	callback(operations.success(true, 'Order placed successfully'));
}

shoppingcart.get = function(token) {
	operations.addContext('shoppingcart.get');
	if(shoppingCarts[token] !== undefined) {
		return operations.success(shoppingCarts[token], 'Shopping cart retrieved successfully');
	}
	else {
		return operations.error('No shopping cart for token ' + token);
	}
}

module.exports = shoppingcart;