//	PROJECT:				rjs2
//	Name:						R. Javier
//	File:						server.js
//	Date Created:		2019-10-06
//	Last Modified:	2019-10-06
//	Details:
//									A web server.
//	Dependencies:
//									n/a

"use strict";

// BEGIN includes
var settings = require( "./util/settings.js" );
var bp = require( 'body-parser' );
var fs = require( "fs" );
var logger = require( `${settings.util}/logger.js` );
var HandlerTag = require( `${settings.util}/class/handlerTag.js` );
var minimist = require( "minimist" );
// END includes

// BEGIN utility functions
// @function			help()
// @description		This function shows the help prompt for the server script
// @parameters		n/a
// @returns				n/a
function help() {
	printEmblem();
	console.log("\n" + fs.readFileSync( `${settings.util}/common/help.txt` ) );
}

// @function			printEmblem()
// @description		This function prints the emblem for the server.
// @parameters		n/a
// @returns				n/a
function printEmblem() {
	console.log( "\n" + fs.readFileSync( `${settings.util}/common/emblem.txt` ).toString() );
}
// END utility functions

// BEGIN main
// @function			main()
// @description		This function is the entry point for the program
// @parameters		(string[]) argv						The arg vector for the process.
// @returns				n/a
function main( argv ) {

	// At script startup, collect arguments
	var ht = new HandlerTag( this );
	var args = minimist( argv.slice( 2 ) );		// cut out "node" & "server" tokens

	// Parse arguments
	if( args.h || args.help ) {
		
		// Show help prompt
		help();
		return;
	} else {

		printEmblem();
	}

	// Initialize logger
	if( !args.v && !args.verbose ) {
		console.log( 'Running in non-verbose logging mode...' );
		logger.logToConsole = false;
	}
	logger.log( 'Initializing...', ht.getTag() );

	// Create server instance
	const express = require( "express" );
	const app = express();
	app.locals.title = 'rjserver2';
	app.locals.email = 'rjavier441@gmail.com';

	// Set static asset locations
	logger.log( 'Preparing static assets...', ht.getTag() );
	app.use( bp.json( {
		strict: true
	} ) );
	app.use( bp.urlencoded( {
		extended: true
	} ) );
	app.use( express.static( settings.root ) );

	// DEBUG
	console.log( 'handlerTag:', ht.getTag() );
	console.log( 'args:', args );
	console.log( 'settings:', settings );
}

// Run main()
main.call( main, process.argv );	// strict mode: points 'this' to main()
// END main

// END server.js
