'use strict';

const users = require('./users');
const menuhelper = require('./menuhelper');
const tokens = require('./tokens');
const helpers = require('./helpers');
const shoppingcart = require('./shoppingcart');
const operations = require('./operations');

const favicon = "data:image/x-icon;base64,\
AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAA\
AAAEAIAAAAAAAAAQAABMLAAATCwAAAAAAAAAAAAD///\
////////////////////////3+/v///////v/+//v+/\
f///////v/+//7//v//////////////////////////\
/////////////////////////////P79/6nmzf+R37/\
/zvHj//////////////////////////////////////\
/////////////////5/fz/t+rV/5Xgwv/X8+j/+P37/\
67n0P+l5cr/6vnz///////+////////////////////\
//////z+/f//////r+fQ/7vr1/+16dT/tenU/8Ht2//\
A7Nr/vuzZ/5rhxP////////////////////////////\
/////8/v3//////6rmzf/h9u7/zPDh/4vdu/+97Nj/m\
OHD/5/ix/+u58//+P37////////////////////////\
/////P79//////+s58//3/Xs/8Xu3f+G27j/oOPH/6D\
jyP+46tX/rOfO//n9+/////////////////////////\
////z+/f//////puXL/9Ty5v/i9u7/refP/6HjyP+s5\
87/1PPm/53ixv/7/vz/////////////////////////\
///+//7//////9r06v+O3r3/zfDi///////8/v3/3PT\
q/5vhxP+769j///////7//v/////////////////+/v\
7//v7+//7+/v//////8vv3/7Ho0v+c4sX/pOPK/6Xnz\
P/h+e///////+759P/Z9+v//f/+////////////////\
//7+/v/+//7///////j9+//3/fv/5vfw/9n47P/w7O7\
/7+zu///////2//z/zN3X/+7w8P//////8PHx/5uhn/\
/t7+7/oaSk/+f07/9r1an/QsaQ/8z25P/V0NP/XWdl/\
2Jsav/e4OD/ury8/1xpZv/Y3Nv///////Dx8P9NV1X/\
mKCe/2VnaP/L7uD/NMSJ/yK8fP+T7Mf/lpWX/2t1c/9\
3f33/rrSz/4CFhP9cgXP/j5yY/+7t7v//////pKmo/1\
dhX/+7vr7/+//+/4ncuv9i0KL/2vfr/+nn6P95goD/R\
E5M/77Cwv/a3Nz/X2Zl/4ySkf/4+Pj///////7+/v/7\
+/v////////////+//7//P79///////8/fz//////4a\
Mi/+lqqr///////j5+f/+/v7////////////9/f3///\
////39/f/+/////v/+//7////+//7//Pz8//////+7v\
7//19nZ///////9/f3//f39//7+/v////////////7+\
/v/////////////////////////////////////////\
/////////////////////////////AAAAAAAAAAAAAA\
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
AAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";

var handlers = {};

handlers.test = function(data, callback) {
        callback(200, {result:'OK'});
}

handlers.notFound = function(data, callback) {
    callback(200, {result:'Not Found'});
}

handlers.faviconData = favicon;

handlers.users = function(data, callback) {

    var acceptableMethods = ['post', 'get', 'put', 'delete']

    if(acceptableMethods.indexOf(data.method) > -1) {
            handlers._users[data.method](data, callback)
    }
    else {
            callback(405);
    }
}

handlers.tokens = function(data, callback) {

    var acceptableMethods = ['post', 'get', 'put', 'delete']

    if(acceptableMethods.indexOf(data.method) > -1) {
            handlers._tokens[data.method](data, callback)
    }
    else {
            callback(405);
    }
}

handlers.menu = function(data, callback) {

	var acceptableMethods = ['get'];

	if(acceptableMethods.indexOf(data.method) > -1) {
		handlers._menu[data.method](data, callback);
	}
	else {
		callback(405);
	}

}

handlers.shoppingcart = function(data, callback) {

	var acceptableMethods = ['get', 'post', 'put', 'delete'];

	if(acceptableMethods.indexOf(data.method) > -1) {
		handlers._shoppingcart[data.method](data, callback);
	}
	else {
		callback(405);
	}

}


handlers.order = function(data, callback) {

	var acceptableMethods = ['get', 'post'];

	if(acceptableMethods.indexOf(data.method) > -1) {
		handlers._order[data.method](data, callback);
	}
	else {
		callback(405);
	}

}

// USERS

handlers._users = {};

handlers._users.post = function(data, callback) {
    //email, address, password
    var requestData = helpers.retrieveRequestData(data, 
        {
            payloadFields:
                [
                    {fieldName:'name', type:'string'},
                    {fieldName:'email', type:'string'},
                    {fieldName:'address', type:'string'},
                    {fieldName:'password', type:'string'}
                ]
        });
    if(requestData) {
        users.createUser(requestData.name, requestData.email, requestData.address, requestData.password, function(opRes) {
            if(opRes.success == true) {
                callback(200, {'result':'OK'});
            }
            else {
                if(opRes.data.info == 'User already exists') {
                    callback(409, {'result':'User already exists'});
                }
                else {
                    callback(500, {'result':'There was a problem creating user'});
                }
            }
        })
    }
    else {
        callback(400, {'result':'Bad request. Some fields might be missing.'});
    }
};

handlers._users.get = function(data, callback) {


};

handlers._users.put = function(data, callback) {


};

handlers._users.delete = function(data, callback) {


};




// TOKENS

handlers._tokens = {};

handlers._tokens.post = function(data, callback) {
    var requestData = helpers.retrieveRequestData(data, 
        {
            payloadFields:
                [
                    {fieldName:'usermail', type:'string'},
                    {fieldName:'password', type:'string'}
                ]
        });
    if(requestData) {
        tokens.create(requestData.usermail, requestData.password, function(opRes) {
            if(opRes.success == true) {
                shoppingcart.create(token); // 'cannot' fail
                callback(200, {'result':'New token created: ' + JSON.stringify(opRes.data.result)});
            }
            else {
                if(opRes.data.info == 'Invalid credentials') {
                    callback(403, {'result':'Cannot create token: invalid credentials'});
                }
                else {
                    callback(500, {'result':'There was a problem creating the token'});
                }
            }
        })
    }
    else {
        callback(400, {'result':'Bad request. Some fields might be missing.'});
    }
};


// MENU

handlers._menu = {};

handlers._menu.get = function(data, callback) {
	callback(200, menuhelper.getMenu());
}


// SHOPPING CART

handlers._shoppingcart = {};

handlers._shoppingcart.get = function(data, callback) {
    var requestData = helpers.retrieveRequestData(data, 
        {
            headerFields: 
                [
                    {fieldName:'token', type:'string'}
                ]
        });
    if(requestData) {

        var token = requestData.token;
        var opRes = shoppingcart.get(token);
        if(opRes.success) {
            callback(200, opRes.data.result);
        }
        else {
            callback(500, {'result':'Could not retrieve shopping cart: '+opRes.data.info});
        }

    }
    else {
        callback(400, {'result':'Bad request. Some fields might be missing.'});
    }
}

/*
// EL SHOPPING CART DEBE CREARSE AL CREAR EL TOKEN
handlers._shoppingcart.post = function(data, callback) {
    var requestData = helpers.retrieveRequestData(data, 
        {
            headerFields: 
                [
                    {fieldName:'token', type:'string'}
                ]
        });
    if(requestData) {

        var token = requestData.token;
        var opRes = shoppingcart.create(token);

    }
    else {
        callback(400, {'result':'Bad request. Some fields might be missing.'});
    }
}
*/

handlers._shoppingcart.put = function(data, callback) {
    var requestData = helpers.retrieveRequestData(data, 
        {
            headerFields: 
                [
                    {fieldName:'token', type:'string'}
                ]
        });
    if(requestData) {
        
    }
}

handlers._shoppingcart.delete = function(data, callback) {


}


// ORDERS

handlers._orders = {};

handlers._orders.post = function(data, callback) {


}

handlers._orders.get = function(data, callback) {


}

module.exports = handlers;
