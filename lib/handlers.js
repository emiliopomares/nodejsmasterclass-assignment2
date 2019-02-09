'use strict';

const users = require('./users');
const menuhelper = require('./menuhelper');
const tokens = require('./tokens');
const helpers = require('./helpers');
const shoppingcart = require('./shoppingcart');
const storage = require('./objectstorage');
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




handlers.order = function(data, callback) {

	var acceptableMethods = ['get', 'post'];

	if(acceptableMethods.indexOf(data.method) > -1) {
		handlers._order[data.method](data, callback);
	}
	else {
		callback(405);
	}

}


//
// USERS
//

handlers.users = function(data, callback) {

    var acceptableMethods = ['post', 'get', 'put', 'delete']

    if(acceptableMethods.indexOf(data.method) > -1) {
            handlers._users[data.method](data, callback)
    }
    else {
            callback(405);
    }
}

handlers._users = {};

handlers._users.get = function(data, callback) {

    operations.addContext("handlers._users.get");

    var requestData = helpers.retrieveRequestData(data,
        {
            headerFields: 
                [
                    {fieldName:'token', type:'string'}
                ]
        }
        );

    if(requestData) {
        tokens.check(requestData.token, function(opRes) {

            if(opRes.success == true) {
                storage.retrieveObject('users', opRes.data.result.email, function(opRes) {
                    if(opRes.success == true) {
                        var showData = opRes.data.result;
                        delete showData["password"];
                        callback(200, showData);            
                    }
                    else {
                        callback(500, opRes.data.info);
                    }
                })
            }
            else {
                callback(403, {'result':'Invalid token'});
            }
        })

    }
    else {
        callback(400, {'result':'Bad request. Must include token in header'});
    }
};

handlers._users.post = function(data, callback) {

    operations.addContext("handlers._users.post");
    
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
        users.create(requestData.name, requestData.email, requestData.address, requestData.password, function(opRes) {
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

handlers._users.put = function(data, callback) {

    operations.addContext("handlers._users.post");

    var requestData = helpers.retrieveRequestData(data, 
        {
            headerFields:
                [
                    {fieldName:'token', type:'string', optional:false}
                ],
            payloadFields:
                [
                    {fieldName:'name', type:'string', optional:true},
                    {fieldName:'address', type:'string', optional:true},
                    {fieldName:'password', type:'string', optional:true}
                ]
        });

    if(requestData) {

        tokens.check(requestData.token, function(opRes) {

            if(opRes.success == true) {
                storage.retrieveObject('users', opRes.data.result.email, function(opRes) {
                    if(opRes.success == true) {
                        
                        users.updateUser(opRes.data.result.email, 
                            requestData.name == undefined ? false : requestData.name, 
                            requestData.email == undefined ? false : requestData.email, 
                            requestData.address == undefined ? false : requestData.address, 
                            requestData.password == undefined ? false : requestData.password, function(opRes) {

                                if(opRes.success == false) {
                                    callback(500, opRes.data.info)
                                }
                                else {
                                    callback(200, opRes.data.result);
                                }

                            });
                        
                                    
                    }
                    else {
                        callback(500, opRes.data.info);
                    }
                })
            }
            else {
                callback(403, {'result':'Invalid token'});
            }
        })
        
        
    }
    else {
        callback(400, {'result':'Bad request. Must include token in header'});
    }

};

handlers._users.delete = function(data, callback) {

    operations.addContext("handlers._users.delete");

    var requestData = helpers.retrieveRequestData(data, 
        {
            headerFields:
                [
                    {fieldName:'token', type:'string', optional:false}
                ]
        });

    if(requestData) {

        tokens.check(requestData.token, function(opRes) {

            if(opRes.success == true) {
                
                users.delete(opRes.data.result.email, function(opRes) {

                    if(opRes.success == true) {
                        tokens.delete(requestData.token, function(opRes) {
                            if(opRes.success == true) {
                                callback(200, {'result':'User deleted OK'});                                    
                            }
                            else {
                                callback(500, opRes.data.info);                                    
                            }
                        });
                    }

                    else {
                        callback(500, opRes.data.info);
                    }
                })
            }
            else {
                callback(403, {'result':'Invalid token'});
            }
        })
    }
    else {
        callback(400, {'result':'Bad request. Must include token in header'});
    }

};



//
// TOKENS
//

handlers.tokens = function(data, callback) {

    var acceptableMethods = ['post', 'delete']

    if(acceptableMethods.indexOf(data.method) > -1) {
            handlers._tokens[data.method](data, callback)
    }
    else {
            callback(405);
    }
}

handlers._tokens = {};

handlers._tokens.post = function(data, callback) {

    operations.addContext("handlers._tokens.post");

    var requestData = helpers.retrieveRequestData(data, 
        {
            payloadFields:
                [
                    {fieldName:'email', type:'string'},
                    {fieldName:'password', type:'string'}
                ]
        });
    if(requestData) {
        tokens.create(requestData.email, requestData.password, function(opRes) {
            if(opRes.success == true) {
                shoppingcart.create(opRes.data.result.id, function(opRes) {
                    if(opRes.success == true) {
                        callback(200, {'result':'New token created: ' + JSON.stringify(opRes.data.result)});
                    }
                    else {
                        callback(500, {'result':'There was a problem creating the shopping cart'});
                    }
                });                
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

handlers._tokens.delete = function(data, callback) {

    operations.addContext("handlers._tokens.delete");

    var requestData = helpers.retrieveRequestData(data, 
        {
            headerFields:
                [
                    {fieldName:'token', type:'string', optional:false}
                ]
        });

    if(requestData) {
        tokens.check(requestData.token, function(opRes) {
            if(opRes.success == true) {
                var tokenToDelete = opRes.data.result.id;
                var userToLogout = opRes.data.result.email;
                tokens.delete(tokenToDelete, function(opRes) {
                    if(opRes.success == true) {
                        shoppingcart.destroy(tokenToDelete, function(opRes) {
                            if(opRes.success == true) {
                                callback(200, {'result':'token destroyed OK. User '+userToLogout+' logged out'})
                            }
                            else {
                                callback(500, {'result':opRes.data.info})
                            }
                        });
                    }
                    else {
                        callback(500, {'result':opRes.data.info})
                    }
                });
            }
            else {
                callback(403, {'result':'Nothing to delete: invalid token'});
            }
        });
    }
    else {
        callback(400, {'result':'Bad request. Must include token in header'});
    }

}

//
// SHOPPING CART
//

handlers.shoppingcart = function(data, callback) {

	var acceptableMethods = ['get', 'put'];

	if(acceptableMethods.indexOf(data.method) > -1) {
		handlers._shoppingcart[data.method](data, callback);
	}
	else {
		callback(405);
	}

}

handlers._shoppingcart = {};

handlers._shoppingcart.get = function(data, callback) {

    operations.addContext("handlers._shoppingcart.get");

    var requestData = helpers.retrieveRequestData(data, 
        {
            headerFields:
                [
                    {fieldName:'token', type:'string', optional:false}
                ]
        });

    if(requestData) {
        var token = requestData.token;
        shoppingcart.get(token, function(opRes) {
            if(opRes.success == true) {
                callback(200, opRes.data.result);
            }
            else {
                callback(500, {'result':opRes.data.info});
            }
        });
    }
    else {
        callback(400, {'result':'Bad request. Must include token in header'});
    }
}

handlers._shoppingcart.put = function(data, callback) {

    operations.addContext("handlers._shoppingcart.put");

    var requestData = helpers.retrieveRequestData(data, 
        {
            headerFields: 
                [
                    {fieldName:'token', type:'string', optional:false}
                ],
            payloadFields:
                [
                    {fieldName:'itemList', type:'object', optional:false}
                ]

        });
    if(requestData) {
        shoppingcart.update(requestData.token, requestData.itemList, function(opRes) {
            if(opRes.success == true) {
                callback(200, {'result':opRes.data.info});
            }
            else {
                callback(500, {'result':opRes.data.info});
            }
        });
    }
    else {
        callback(400, {'result':'Bad request'});
    }
}



//
// MENU
//

handlers.menu = function(data, callback) {

	var acceptableMethods = ['get'];

	if(acceptableMethods.indexOf(data.method) > -1) {
		handlers._menu[data.method](data, callback);
	}
	else {
		callback(405);
	}

}

handlers._menu = {};

handlers._menu.get = function(data, callback) {
	callback(200, menuhelper.getMenu());
}





// SHOPPING CART
/*
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
*/
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
/*
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
*/

// ORDERS

handlers._orders = {};

handlers._orders.post = function(data, callback) {


}

handlers._orders.get = function(data, callback) {


}

module.exports = handlers;
