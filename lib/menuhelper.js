const menu = require('../menu.js');

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
	return {
		isValidItem : menudictionary[itemName] !== undefined ? true : false,
		item : menudictionary[itemName] !== undefined ? menudictionary[itemName] : {}
	};
}

menuhelper.init();

console.dir(menuhelper.getMenu());

module.exports = menuhelper;
