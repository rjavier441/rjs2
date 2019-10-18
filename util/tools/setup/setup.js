//	PROJECT:				rjs2
//	Name:						R. Javier
//	File:						setup.js
//	Date Created:		2019-10-16
//	Last Modified:	2019-10-16
//	Details:
//									A setup utility to enable server setup
//	Dependencies:
//									NodeJS v8+

'use strict';

// BEGIN includes
var _lib = require( '../../_lib.js' );
var fs = require( 'fs' );
var minimist = require( 'minimist' );
var req = require( './res/required.json' );
// END includes

// BEGIN utility functions
// @function			setupDirs()
// @description		This function ensures the mandatory server directories exist.
// @parameters		n/a
// @returns				n/a
function setupDirs() {

  // DEBUG
  _lib.ColorLogger.log( 'Setting up server file system', {
    theme: 'primary'
  } );

  // Check all required directories
  req.dir.forEach( function( pathFromServerRoot ) {

    var fullpath = `${_lib.settings.serverPath}/${pathFromServerRoot}`;
    _lib.ColorLogger.log( `Checking ${fullpath}...` );
    if( !fs.existsSync(fullpath) ) {
      
      _lib.ColorLogger.log( `\tCreating ${fullpath}...` );
      fs.mkdirSync( fullpath );
    }
    _lib.ColorLogger.log( '\tDone' );
  } );
}

// @function			help()
// @description		This function shows the help prompt for the setup script.
// @parameters		n/a
// @returns				n/a
function help() {
  _lib.Util.printEmblem();
  console.log(
    '\n' + fs.readFileSync( `${_lib.settings.util}/tools/setup/res/help.txt` )
  );
}
// END utility functions

// BEGIN main()
// @function			main()
// @description		The setup script's entry point
// @parameters		(string[]) argv       The process's argument vector.
// @returns				n/a
function main( argv ) {
  var ht = new _lib.Class.HandlerTag( this );
  var args = minimist( argv.slice(2) );

  // Parse arguments
  if( args.h || args.help ) {

    // Show help prompt
    help();
    return;
  }
  
  _lib.Util.printEmblem();
  setupDirs();
}

// Run main()
main.call( main, process.argv );
// END main()

// END setup.js
