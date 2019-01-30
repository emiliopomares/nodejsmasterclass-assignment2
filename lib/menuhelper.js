const menu = require('../menu.js');
const operations = require('./operations');

var menuhelper = {};

var menudictionary = {};

menuhelper.init = function() {
	menu.forEach(function(item) {
		menudictionary[item.name] = item;
	});
}

menuhelper.getMenu = function() {
	return menu;
}

menuhelper.getMenuItem = function(itemName) {
	operations.addContext("menuhelper.getMenuItem");
	var isValidItem = menudictionary[itemName] !== undefined ? true : false;
	if(isValidItem) {
		return operations.success(menudictionary[itemName], 'Item retrieved successfully');
	}
	else {
		return operations.error('Menu item not found: ' + itemName);
	}
}

menuhelper.init();

module.exports = menuhelper;
