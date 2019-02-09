const config = require('../config')

var log = {};

log.getDateTime = function() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + " " + hour + ":" + min + ":" + sec;

}

function mustLog(context) {
	for(var i = 0; i < config.logOperations.length; ++i) {
		if(config.logOperations[i]=="*") return true;
		if(config.logOperations[i].indexOf("*") != -1) {
			var base = config.logOperations[i].replace("*", "");
			if(context.startsWith(base)) return true;
		}
		else {
			if(config.logOperations[i] == context) return true;
		}
	}
	return false;
}

log.add = function (headContext, fullContext, opData) {
	if(mustLog(headContext)) {
		var logObject = {
			context : fullContext,
			datetime : log.getDateTime(), 
			operation : {
				success : opData.success,
				data: {
					result:	JSON.stringify(opData.data.result),
					info: opData.data.info
				}
			}
		}
		if(config.logToConsole) {
			console.dir(logObject);
			console.log("");
		}
	}
}

module.exports = log;
