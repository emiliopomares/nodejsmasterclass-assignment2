var environments = {};

environments.staging = {
	httpPort : 8080,
	httpsPort : 9090,
	envName : 'staging',
	hashingSecret : 'hTweWR45hQnYc23mFVgJFsjd245fAFhb',
	mailgunToken : 'a token',
	logOperations : 
		[ 'createUser',
		  'validateUser',
		  'storeObject',
		  'retrieveObject'
		]
		  
};

environments.production = {
	httpPort : 8080,
        httpsPort : 9090,
        envName : 'staging',
        hashingSecret : '85hD77hPPhe743OM7834gfWj7iHy7iTf',
        mailgunToken : 'another token',
	logOperations : []
};

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging

module.exports = environmentToExport

