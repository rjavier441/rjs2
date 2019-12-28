//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					api/app/app.js
//	@Date Created:	2019-10-13
//	@Last Modified:	2019-10-19
//	@Details:
//									This file contains the API sub-app used to map APIs in the
//									'routes/' directory. It is used by the main app in server.js
//	@Dependencies:
//									ExpressJS 4.x
//									body-parser (NPM middleware required by ExpressJS 4.x to
//									read POST data parameters: 'npm install --save body-parser')

"use strict"

// Includes
var express = require( "express" );
var settings = require( "../../util/settings" );	// import server system settings
var logger = require( `${settings.util}/logger` );	// import event log system
var bodyParser = require( "body-parser" );			// import POST request data parser
var autoloader = require( `${settings.util}/route_autoloader` );
// var abilityRoutes = require( "./routes/ability" );	// import SCE Core-v4 Ability API routes
// var userRoutes = require( "./routes/user" );		// import SCE Core-v4 User API routes

// Globals
var handlerTag = { "src": "apiRouter" };



// API App
logger.log( `Initializing rjs2 APIs...`, handlerTag );
var app = express();
app.use(bodyParser.json({			// support JSON-encoded request bodies
	strict: true
}));
app.use(bodyParser.urlencoded({		// support URL-encoded request bodies
	extended: true
}));



// Use the api route autoloader to load api routes in this file's directory
autoloader.api.load( app, __dirname );
// autoloader.load( app, [
// 	{
// 		"endpoint": "/user",
// 		"indexPath": __dirname + "/routes/user"
// 	},
// 	{
// 		"endpoint": "/ability",
// 		"indexPath": __dirname + "/routes/ability"
// 	}
// ] );

// Legacy endpoint routing:
// @api				/ability
// @descrip	ion		This API routes to the Ability module's endpoints
// app.use( "/ability", abilityRoutes );		// serves the MongoDB Test Interface page

// @api				/user
// @description		This API routes to the User module's endpoints
// app.use( "/user", userRoutes );

// @api				/clevel
// @description		This API routes to the Clearance Level module's endpoints
// app.use( "/clevel", );



module.exports = app;
// END core/app/app.js
