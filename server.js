//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					server.js
//	@Date Created:	2019-10-06
//	@Last Modified:	2019-10-06
//	@Details:
//									A web server.
//	@Dependencies:
//									n/a

'use strict';

// BEGIN includes
const _lib = require( './util/_lib.js' );
const bp = require( 'body-parser' );
const fs = require( 'fs' );
const path = require( 'path' );
const ejs = require( 'ejs' );
const http = require( 'http' );
const https = require( 'https' );
const minimist = require( 'minimist' );
const cookieParser = require( 'cookie-parser' );
// END includes

// BEGIN utility functions
// @function			help()
// @description		This function shows the help prompt for the server script
// @parameters		n/a
// @returns				n/a
function help() {
	_lib.Util.printEmblem();
	console.log('\n' + fs.readFileSync( `${_lib.settings.util}/common/help.txt` ) );
}
// END utility functions

// BEGIN main
// @function			main()
// @description		This function is the entry point for the program
// @parameters		(string[]) argv						The arg vector for the process.
// @returns				n/a
function main( argv ) {

	// At script startup, collect arguments
	var ht = new _lib.Class.HandlerTag( this );
	var args = minimist( argv.slice( 2 ) );		// cut out 'node' & 'server' tokens

	// Parse arguments
	if( args.h || args.help ) {
		
		// Show help prompt
		help();
		return;
	} else {

		_lib.Util.printEmblem();
	}

	// Initialize logger
	if( !args.v && !args.verbose ) {
		console.log( 'Running in non-verbose logging mode...' );
		_lib.Logger.logToConsole = false;
	}
	_lib.Logger.log( 'Initializing...', ht.getTag() );

	// Create server instance
	const express = require( 'express' );
	const app = express();
	app.locals.title = _lib.settings.meta.serverName;
	app.locals.email = _lib.settings.meta.serverEmail;

	// Set static asset locations
	_lib.Logger.log( 'Preparing static assets...', ht.getTag() );
	app.use( bp.json( {
		strict: true
	} ) );
	app.use( bp.urlencoded( {
		extended: true
	} ) );
	// app.use( express.static( _lib.settings.root ) );

	// Add cookie parser
	app.use( cookieParser() );

	// BEGIN DEPRECATED 2020-02-01: Replaced with new API creation scheme
	// Load and mount APIs under "/api" using the old API Autoloader
	// app.use( '/api', require( './api/app/app.js' ) );		// RESTful APIs
	// END DEPRECATED 2020-02-01: Replaced with new API creation scheme
	
	// Load and mount static content in the server root using the new Autoloader
	( new _lib.AutoLoader( {
		ejs: ejs,
		fs: fs,
		path: path,
		HandlerTag: _lib.Class.HandlerTag,
		Logger: _lib.Logger,
		ServerError: _lib.Class.ServerError,
		ServerResponse: _lib.Class.ServerResponse,
		TemplateManager: _lib.TemplateManager,
		Util: _lib.Util,
	} ) ).loadRootFrom( app, _lib.settings.root );

	// Check if server should run in secure mode
	var secureMode = true;
	if( args.i || args.http ) {
		secureMode = false;
	}

	// Run server
	var port = _lib.settings.port;
	var server = false;
	if( args.p || args.port ) {
		port = args.p ? args.p : args.port;
	}
	if( secureMode ) {
		// Check for security configurations
		if( !fs.existsSync( _lib.settings.ssl ) ) {
			throw new Error( new _lib.Class.ServerError(
				`SSL settings not found! Have you configured security settings?`
			) );
		} else {
			server = https.createServer( _lib.SslManager.serverContext, app );
		}
	} else {
		server = http.createServer( {}, app );
	}
	server.listen( secureMode ? port : { port: port }, function() {
		var msg = `Now listening on port ${port}`;
		if( !secureMode ) {
			msg += ' (insecure mode)';
		}
		_lib.Logger.log( msg, ht.getTag() );
	} );

	// // DEBUG
	// console.log( 'handlerTag:', ht.getTag() );
	// console.log( 'args:', args );
	// console.log( 'settings:', _lib.settings );

	return;
}

// Run main()
main.call( main, process.argv );	// strict mode: points 'this' to main()
// END main

// END server.js
