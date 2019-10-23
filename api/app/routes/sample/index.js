//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					api/app/routes/sample/index.js
//	@Date Created:	2019-10-21
//	@Last Modified:	2019-10-21
//	@Details:
//									This file contains routing logic to service all routes
//									requested under the 'Sample' endpoint (a.k.a. the
//									Sample Module).
//	@Dependencies:
//									n/a

'use strict';

// Includes (include as many as you need; the bare essentials are included here)
var _lib = require( '../../../../util/_lib.js' );
var fs = require('fs');
var express = require('express');
var https = require('https');
var router = express.Router();
// var ssl = require(_lib.settings.security);	// import https ssl credentials

// Required Endpoint Options
var options = {
	root: _lib.settings.root,	// Server root directory (i.e. where server.js is located)
	dotfiles: 'deny',
	headers: {
		'x-timestamp': Date.now(),
		'x-sent': true
	}
};
var ssl_user_agent = new https.Agent({
	'port': _lib.settings.port,
	'ca': fs.readFileSync(ssl.cert)
});

// Example API Documentation Arguments
var api = _lib.ApiLegend.createLegend(
	'Sample',
	'A Sample API',
	router					// reference to the router object
);
var apiInfo = {
	'args': {},
	'rval': {}
};



// BEGIN Sample Routes

// Example API route
apiInfo.args.sample = [
	{
		'name': 'API argument #1',
		'type': '~string',		// '~' = optional
		'desc': 'An optional string argument for this API'
	}
];
apiInfo.rval.sample = [
	{
		'condition': 'On success',
		'desc': 'This function returns true'
	},
	{
		'condition': 'On failure',
		'desc': 'This function returns false'
	}
];
api.register(
	'Example API Endpoint Name',
	'GET',							// http request type string
	'/ping',
	'Pings the Sample API',
	apiInfo.args.sample,		// the API's request arguments (i.e. body/querystring)
	apiInfo.rval.sample,		// the API's response/return values
	function ( request, response ) {

		response.set( "Content-Type", "application/json" );
		response.send( new _lib.ServerResponse( 'Ping!' ) ).status( 200 ).end();
	}
);


// END Sample Routes

module.exports = router;

// END api/app/routes/sample/index.js
