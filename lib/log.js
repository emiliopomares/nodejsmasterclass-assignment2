const config = require('../config')

var log = {};

function getDateTime() {

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

log.add = function (headContext, fullContext, opData) {
	if(config.logOperations.indexOf(headContext) !== -1) {
		var logObject = {
			context : fullContext,
			datetime : getDateTime(), 
			operation : {
				success : opData.success,
				data: {
					result:	JSON.stringify(opData.data.result),
					info: opData.data.info
				}
			}
		}
		console.dir(logObject);
		console.log("");
	}
}

module.exports = log;