//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					skeleton/app/app.js
//	@Date Created:	2019-10-27
//	@Last Modified:	2019-10-27
//	@Details:
//									This file contains a skeleton sub-application that can be
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
const routes = require( './routes' );		// import routes
// END includes


// BEGIN globals
const ht = { 'src': 'skeletonRouter' };
// END globals


// BEGIN sub-app logic
// Initialize Glue App
_lib.Logger.log( `Initializing skeleton router...`, ht );
const app = express();
app.use( bp.json( {				// support JSON-encoded request bodies
	strict: true
} ) );
app.use( bp.urlencoded( {	// support URL-encoded request bodies
	extended: true
} ) );


// Assign Glue Route
app.use( '/', routes );		// serves the skeleton route endpoints
// END sub-app logic


module.exports = app;

// END skeleton/app/app.js
