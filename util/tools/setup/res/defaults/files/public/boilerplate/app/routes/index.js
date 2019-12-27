//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					boilerplate/app/routes/index.js
//	@Date Created:	2019-12-13
//	@Last Modified:	2019-12-13
//	@Details:
//									Defines application routing logic for all routes requested
//                  under the '/' endpoint (a.k.a. 'boilerplate/' application).
//	@Dependencies:
//									ExpressJS 4.x
//									body-parser	(NPM middleware req'd by ExpressJS 4.x to
//															acquire POST data parameters: 'npm install
//															--save body-parser')

'use strict';

// BEGIN Includes
const _lib = require( '../../../../util/_lib.js' );
const express = require( 'express' );
const router = express.Router();
// END Includes

// BEGIN Globals
const parentAppRoute = '/boilerplate';
// END Globals

// BEGIN Application Routes
// @endpoint			(GET) /
// @description		Serves this application's top-level route
// @parameters		(object) request			The web request object provided by
//																			express.js. The request querystring does
//	                                    not take any parameters.
//								(object) response			The web response object provided by
//																			express.js.
// @returns				n/a
router.get( '/', function( request, response ) {

  const ht = new _lib.Class.HandlerTag( { src: '(GET) boilerplate/' }, 'route' );

  // Log the access to this endpoint
  _lib.Logger.log( `Requesting ${request}`, ht );

  // Send data
  response.status( 200 ).send(
    'hello world'
  ).end();
} );
// END Application Routes


// Use the StaticAutoLoader to automatically mount static resources to routes
let relativeMountPoint = '/';	// "/" is in reference to the parent app route.
let appRoot = __dirname.substring( 0, __dirname.indexOf('/app/routes') );
_lib.StaticAutoLoader.load( router, relativeMountPoint, appRoot );


// BEGIN Error Handling Routes
// @endpoint			.
// @description		Prevenst the client from using '.' and '..' to navigate the
//								server file system.
// @parameters		n/a
// @returns				A code 403, and a ServerError instance
router.use( '/.', function( request, response ) {
	
	let ht = new _lib.Class.HandlerTag(
		`/FORBIDDEN (${parentAppRoute}/.)`,
		'string'
	).getTag();
	_lib.Logger.log( `Dotfile use blocked for client @ ip ${request.ip}`, ht );

	response.status( 403 ).send(
		new _lib.Class.ServerError( 'Forbidden', {}, 403 )
	).end();
} );

// @endpoint			..
// @description		Prevenst the client from using '.' and '..' to navigate the
//								server file system.
// @parameters		n/a
// @returns				A code 403, and a ServerError instance
router.use( '/..', function( request, response ) {
	
	let ht = new _lib.Class.HandlerTag(
		`/FORBIDDEN (${parentAppRoute}/..)`,
		'string'
	).getTag();
	_lib.Logger.log( `Dotfile use blocked for client @ ip ${request.ip}`, ht );

	response.status( 403 ).send(
		new _lib.Class.ServerError( 'Forbidden', {}, 403 )
	).end();
} );

// @endpoint			NOTFOUND (404)
// @description		This function handles any endpoint requests that do not exist
//	              under this app module's '/' endpoint
// @parameters		n/a
// @returns				A code 404, and a ServerError instance
router.use(function (request, response) {

	// Log 404 error
	var handlerTag = {'src': `/NOTFOUND (${parentAppRoute})`};
	_lib.Logger.log(`Non-existent endpoint '${request.path}' requested from client @ ip ${request.ip}\nRaw Headers:${ request.rawHeaders }` ,handlerTag);

	// Send 404 response
	response.status( 404 ).send(
		new _lib.Class.ServerError( 'Not Found', {}, 404 )
	).end();
});

// @endpoint			ERROR (for any other errors)
// @description		This function sends an error status (500) if an error
//                occurred forcing the other methods to not run.
// @parameters		n/a
// @returns				A code 500, and a ServerError instance
router.use(function (err, request, response) {
	
	// Log 500 error
	var handlerTag = {'src': `/ERROR (${parentAppRoute})`};
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

// END boilerplate/app/routes/index.js
