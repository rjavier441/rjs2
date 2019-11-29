//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					config.js
//	@Date Created:	2019-11-27
//	@Last Modified:	2019-11-27
//	@Details:
//									A setup utility to enable server configuration.
//	@Dependencies:
//									NodeJS v8+

'use strict';

// BEGIN includes
const _lib = require( '../../_lib_optin.js' )._optin( [
  'settings',
  'ColorLogger',
  'Class.HandlerTag',
  'Class.ServerError',
  'Util'
] );
const fs = require( 'fs' );
const minimist = require( 'minimist' );
// END includes

// BEGIN globals
const logStyle = {
  stepHeader: { theme: 'primary', style: [ 'bold' ] },
  failure: { theme: 'failure' }
};
// END globals

// BEGIN utility functions
// @function      help()
// @description		This function shows the help prompt for the config script.
// @parameters		n/a
// @returns				n/a
function help() {
  _lib.Util.printEmblem();
  console.log(
    '\n' + fs.readFileSync( `${_lib.settings.util}/tools/config/res/help.txt` )
  );
}

// @function      runScripts()
// @description		This function runs config scripts for this OS.
// @parameters		(string) os           The name of the OS platform of this
//                                      machine.
//                (string[]) scripts    A list of script names to run. If given,
//                                      the scripts in the list are executed in
//                                      order.
// @returns				n/a
function runScripts( os, scripts = false ) {
  var scriptsDir = `${__dirname}/scripts/${os}`;
  var scriptSequence = false

  // Determine the list of scripts to run
  if( scripts ) {
    scriptSequence = scripts;
  } else {
    scriptSequence = fs.readdirSync( scriptsDir );
  }

  // Check for script order override
  if( scriptSequence.includes( 'order.json' ) ) {
    scriptSequence = JSON.parse(
      fs.readFileSync( `${scriptsDir}/order.json` )
    ).order;
  }

  // Traverse script sequence in order
  var queue = [];
  scriptSequence.forEach( function( filename ) {

    // Ensure script exists
    var filepath = `${scriptsDir}/${filename}`;
    if( !fs.existsSync( filepath ) ) {

      _lib.ColorLogger.log(
        `\tError: Cannot find ${filepath}`,
        logStyle.failure
      );
    } else {

      // Place script functions in a queue
      queue.push( require( filepath ) );
    }
  } );

  // Generate and execute a promise chain on creation
  var chain = false;
  queue.forEach( ( module ) => {

    if( !chain ) {
      chain = new Promise( ( resolve, reject ) => {
        module.script( resolve, reject );
      } );
    } else {
      chain = chain.then( ( resolutionValue ) => {

        return new Promise( ( resolve, reject ) => {
          module.script( resolve, reject );
        } );
      }, ( rejectionReason ) => {

        _lib.ColorLogger.log(
          `Chain Rejection: ${rejectionReason}`,
          logStyle.failure
        );
      } );
    }
  } );
  chain.catch( ( error ) => {
    _lib.ColorLogger.log( `Chain Exception: ${error}`, logStyle.failure );

  } );
  chain.then( ( endResult ) => {
    _lib.ColorLogger.log( `All Configurations Complete`, logStyle.stepHeader );
  } );
}
// END utility functions

// BEGIN main
// @function			main()
// @description		The config script's entry point
// @parameters		(string[]) argv       The process's argument vector.
// @returns				n/a
function main( argv ) {
  var ht = new _lib.Class.HandlerTag( this );
  var args = minimist( argv.slice(2) );

  // Parse Arguments
  if( argv.length < 3 || args.h || args.help ) {
    
    // Show help prompt
    help();
    return;
  } else if( args.A ) {
    
    // Run scripts
    runScripts( _lib.Util.getPlatform() );
  }
}
// END main

// Run main
main.call( main, process.argv );

// END config.js
