operation = {};

operation.error = function (msg) {
        return {
                success : false,
                data : {
                        result : null,
                        info : msg
                }
        };
}

operation.success = function (result, msg) {
        return {
                success : true,
                data : {
                        result : result,
                        info : msg
                }
        };
}

module.exports = operation;
