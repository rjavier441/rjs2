//	@PROJECT:				rjs2
//	@Name:					[author]
//	@File:					[filename]
//	@Date Created:	[dateCreated]
//	@Last Modified:	[dateCreated]
//	@Details:
//									This file contains routing logic to service all routes
//									requested under the '[endpoint]' endpoint (a.k.a. the
//									[moduleName] Module).
//	@Dependencies:
//									[Dependencies]

'use strict';

// BEGIN includes
var _lib = require( '../../../../util/_lib.js' );
var express = require('express');
var router = express.Router();
// Include other libraries here...
// END includes

// Example API Documentation Arguments
// var api = al.createLegend(
// 	'Example API Name',
// 	'Example API Desc',
// 	router					// reference to the router object
// );
// var apiInfo = {
// 	'args': {},
// 	'rval': {}
// };



// BEGIN [Module] Routes

// Example API route
// apiInfo.args.example = [
// 	{
// 		'name': 'API argument #1',
// 		'type': '~string',		// '~' = optional
// 		'desc': 'An optional string argument for this API'
// 	}
// ];
// apiInfo.rval.example = [
// 	{
// 		'condition': 'On success',
// 		'desc': 'This function returns true'
// 	},
// 	{
// 		'condition': 'On failure',
// 		'desc': 'This function returns false'
// 	}
// ];
// api.register(
// 	'Example API Endpoint Name',
// 	'GET',							// http request type string
// 	'/exampleEndpointUrl',
// 	'Example API Endpoint Desc',
// 	apiInfo.args.example,			// the API's request arguments (i.e. body/querystring)
// 	apiInfo.rval.example,			// the API's response/return values
// 	function ( request, response ) {

// 		// Some callback function to run when this endpoint is requested
// 	}
// );


// END [Module] Routes

module.exports = router;

// END [filename]
