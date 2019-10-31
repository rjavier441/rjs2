//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					skeleton/app/routes/index.js
//	@Date Created:	2019-10-28
//	@Last Modified:	2019-10-28
//	@Details:
//									This file contains logic to service all routes requested
//									under the skeleton app.
//	@Dependencies:
//									ExpressJS 4.x
//									body-parser	(NPM middleware req'd by ExpressJS 4.x to
//															acquire POST data parameters: 'npm install
//															--save body-parser')

"use strict";

// Includes
const _lib = require( '../../../../util/_lib.js' );
const express = require("express");
const router = express.Router();

// Options
const options = {
	root: _lib.settings.root,	// Server root directory (i.e. where server.js is located)
	dotfiles: "deny",
	headers: {
		"x-timestamp": Date.now(),
		"x-sent": true
	}
};



// BEGIN Main Routes
/*
	@endpoint	/
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	n/a
	@details 	This function serves the root endpoint of the skeleton app
	@note		Since the server routes "/" to this endpoint and this endpoint is under an extra
				directory "/skeleton", this endpoint requires a path offset to cover the
				"/skeleton" directory,
*/
var pathOffset = "/skeleton";
router.get( "/", function ( request, response ) {

	// Log the access to this endpoint
	var handlerTag = { "src": "skeletonRootHandler" };
	_lib.Logger.log( `Skeleton requested from client @ ip ${ request.ip }\nRaw Headers:${ request.rawHeaders }`, handlerTag );
	_lib.Logger.log( request.toString(), handlerTag );

	// Send a response to the request
	response.set( "Content-Type", "text/html" );
	response.sendFile( `${ pathOffset }/skeleton.html`, options, function ( error ) {
		if ( error ) {
			_lib.Logger.log( error, handlerTag );
			response.status( 500 ).send(
				new _lib.Class.ServerError( 'An internal server error occurred' )
			).end();
		} else {
			_lib.Logger.log( `Sent skeleton.html to ${ _lib.settings.port }`, handlerTag );
			response.status( 200 ).end();
		}
	});
});
// END Main Routes



// BEGIN Error Handling Routes
/*
	@endpoint 	NOTFOUND (404)
	@parameter 	n/a
	@returns 	n/a
	@details 	This function handles any endpoint requests that do not exist under the "/skeleton" endpoint
*/
router.use(function (request, response) {

	// Log 404 error
	var handlerTag = {"src": "/NOTFOUND"};
	_lib.Logger.log(`Non-existent endpoint "${request.path}" requested from client @ ip ${request.ip}\nRaw Headers:${ request.rawHeaders }` ,handlerTag);

	// Send 404 response
	response.status( 404 ).send(
		new _lib.Class.ServerError( 'Not Found', {}, 404 )
	).end();
});

/*
	@endpoint 	ERROR (for any other errors)
	@parameter 	n/a
	@returns 	n/a
	@details 	This function sends an error status (500) if an error occurred forcing the other methods to not run.
*/
router.use(function (err, request, response) {
	
	// Log 500 error
	var handlerTag = {"src": "/ERROR"};
	_lib.Logger.log(`Error occurred with request from client @ ip ${request.ip}\nRaw Headers:${ request.rawHeaders }`);

	// Send 500 response
	response.status( 500 ).send(
		new _lib.Class.ServerError( 'An internal server error occurred' )
		// new _lib.Class.ServerError( err.message )	// unsafe for production use
	).end();
});
// END Error Handling Routes



// BEGIN Utility Functions
// END Utility Functions



module.exports = router;
// END core/app/routes/index.js
