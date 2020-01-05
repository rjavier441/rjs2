//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					test/app/app.js
//	@Date Created:	2019-12-27
//	@Last Modified:	2019-12-27
//	@Details:
//									This file contains a test sub-application that can be
//									mounted at any desired endpoint by the server.
//	@Dependencies:
//									ExpressJS 4.x
//									body-parser	(NPM middleware req'd by ExpressJS 4.x to
//															acquire POST data parameters: 'npm install
//															--save body-parser')

'use strict';

// BEGIN includes
const _lib = require( '../../../util/_lib.js' );
const bp = require( 'body-parser' );		// import POST request data parser
const express = require( 'express' );
const fs = require( 'fs' );
const routes = require( './routes' );		// import routes
// END includes


// BEGIN globals
const ht = { 'src': 'testRouter' };
// END globals


// BEGIN sub-app logic
// Initialize Glue App
_lib.Logger.log( `Initializing test router...`, ht );
const app = express();
app.use( bp.json( {				// support JSON-encoded request bodies
	strict: true
} ) );
app.use( bp.urlencoded( {	// support URL-encoded request bodies
	extended: true
} ) );


// Assign Glue Route
app.set( 'title', ht.src );
app.set( 'parentRoute', '/test' );
app.use( '/', routes );		// serves the test route endpoints
// END sub-app logic

// // DEBUG
// // console.log( Object.keys( app ) );
// // app.set( 'name', ht.src );
// app.locals.name = ht.src;
// _lib.Logger.log( 'testRouter Stack: ' + JSON.stringify(
// 	app._router.stack,
// 	null,
// 	2
// ) );

module.exports = app;

// END test/app/app.js
