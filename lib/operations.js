const log = require('./log');

operations = {};

operations.context = [];

operations.addContext = function(context) {
	operations.context.push(context);
}

operations.removeLastContext = function() {
	if(operations.context.length > 0) return operations.context.pop();
	else return "No Context";
}

operations.readContext = function() {
	var fullContext = "";
	for(var i = 0; i < operations.context.length; ++i) {
		fullContext += ("/" + operations.context[i]);
	}
	return fullContext;
}

operations.error = function (msg) {
	var fullContext = operations.readContext();
	var headContext = operations.removeLastContext();
	var result = {
                success : false,
                data : {
                        result : null,
                        info : msg
                }
        };
	log.add(headContext, fullContext, result);
	return result;
}

operations.success = function (result, msg) {
	var fullContext = operations.readContext();
	var headContext = operations.removeLastContext();
        var result = {
                success : true,
                data : {
                        result : result,
                        info : msg
                }
        };
	log.add(headContext, fullContext, result);
	return result;
}

module.exports = operations;
