var environments = {};

environments.globals = {
	StoreName : "Pepper's Pizza"
}

environments.staging = {
	httpPort : 8080,
	httpsPort : 9090,
	envName : 'staging',
	hashingSecret : 'hTweWR45hQnYc23mFVgJFsjd245fAFhb',
	stripeToken: {
		'public':'pk_test_n8U7i5I1NrS3lepQXYfy7vYx',
		'secret':'sk_test_SCnZEyj8Lk5CbY1f8MQVEZof'
	},
	mailgunToken : 'e781234eed25cc7461a7f4fb572f096a-47317c98-65371669',
	mailgunDomain : 'sandboxf1b2c14cdfb049a1ac72868f8f33646a.mailgun.org',
	mailgunFromUser : 'pepperspizza',
	randomStringLength: 10,
	logOperations : 
		[ 
		  '*',
		  'createUser',
		  'createToken',
		  'validateCredentials',
		  'storeObject',
		  'retrieveObject',
		  'shoppingcart.*'
		],
	globals : environments.globals
		  
};

environments.production = {
	httpPort : 80,
        httpsPort : 443,
        envName : 'production',
        hashingSecret : '85hD77hPPhe743OM7834gfWj7iHy7iTf',
        mailgunToken : 'another token',
	randomStringLength: 20,
	logOperations : 
		[

		],
	globals : environments.globals
};



var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging

module.exports = environmentToExport

