//	@PROJECT:				rjs2
//	@Name:						R. Javier
//	@File:						setup.js
//	@Date Created:		2019-10-16
//	@Last Modified:	2019-10-18
//	@Details:
//									A setup utility to enable server setup
//	@Dependencies:
//									NodeJS v8+

'use strict';

// BEGIN includes
var _lib = require( '../../_lib.js' );
var cp = require( 'child_process' );
var fs = require( 'fs' );
var minimist = require( 'minimist' );
var req = require( './res/required.json' );
// END includes

// BEGIN globals
const logStyle = {
  stepHeader: { theme: 'primary', style: [ 'bold' ] },
  failure: { theme: 'failure' }
};
var errorList = [];
// END globals

// BEGIN utility functions
// @function			printSummary()
// @description		Prints the setup aftermath summary
// @parameters		n/a
// @returns				n/a
function printSummary() {
  _lib.ColorLogger.log( '\n' );
  _lib.ColorLogger.log( 'Server Setup Summary:', { style: 'bold' } );
  _lib.ColorLogger.log(
    errorList.length > 0 ? 'FAILURE' : 'SUCCESS',
    {
      theme: ( errorList.length > 0 ? 'danger' : 'success' )
    }
  );

  errorList.forEach( function( emsg ) {
    _lib.ColorLogger.log( `\t${emsg}`, logStyle.failure );
  } );
}

// @function			pushError()
// @description		This function adds an error descriptor to the errors list for
//	              use in the final setup summary.
// @parameters		(string) emsg         The error message to describe the error.
// @returns				n/a
function pushError( emsg ) {
  _lib.ColorLogger.log( `\t${emsg}`, logStyle.failure );
  errorList.push( emsg );
}

// @function			runScripts()
// @description		This function runs the setup scripts corresponding to the
//	              given OS name
// @parameters		(string) os           The name of the `scripts/` subdirectory
//	                                    housing the setup scripts for the
//	                                    corresponding operating system
// @returns				n/a
function runScripts( os ) {
  var scriptsDir = `${__dirname}/scripts/${os}`;
  var scriptSequence = false;

  // Read script directory to determine list of scripts to run
  var files = fs.readdirSync( scriptsDir );
  if( files.includes( 'order.json' ) ) {
    scriptSequence = JSON.parse(
      fs.readFileSync( `${scriptsDir}/order.json` )
    ).order;
  } else {
    scriptSequence = files;
  }

  // Traverse script sequence in order
  scriptSequence.forEach( function( filename ) {
    var scriptResult = ( require( `${scriptsDir}/${filename}` ) )();
    if( scriptResult instanceof _lib.Class.ServerError ) {
      pushError( scriptResult.message );
    }
  } );

  // DEBUG
  // _lib.ColorLogger.log( scriptSequence.toString(), );
}

// @function			setupDirs()
// @description		This function ensures the mandatory server directories exist.
// @parameters		n/a
// @returns				n/a
function setupDirs() {

  // DEBUG
  _lib.ColorLogger.log( 'Setting up server file system', logStyle.stepHeader );

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

// @function			setupFiles
// @description		This function ensures the existence and configuration of all
//	              required files. This routine should be run after setup of
//	              OS utilities and directories.
// @parameters		n/a
// @returns				n/a
function setupFiles() {

  // DEBUG
  _lib.ColorLogger.log( 'Setting up required files', logStyle.stepHeader );

  // TODO: Check all required files exist
}

// @function			setupOSUtils()
// @description		This function installs and sets up required libraries based
//	              on the platform that this server runs on.
// @parameters		n/a
// @returns				(bool) success        True on success, false otherwise.
function setupOSUtils() {

  var success = true;

  // DEBUG
  _lib.ColorLogger.log( 'Setting up system utilities', logStyle.stepHeader );

  // For each OS:
  // TODO: Ensure Node is installed and is an appropriate version
  // TODO: Ensure npm is installed and is an appropriate version
  // TODO: Run an npm install to acquire all required node packages
  switch( _lib.Util.getPlatform() ) {
    case "MacOS": {
      _lib.ColorLogger.log( 'MacOS is not yet supported' , logStyle.failure );
      break;
    }
    case "Windows": {
      _lib.ColorLogger.log( 'Windows is not yet supported' , logStyle.failure );
      break;
    }
    case "Linux": {
      // TODO: Consolidate these steps into an iterative routine that scans the
      // script dir and runs all scripts for Linux setup
      // // Check for NodeJS
      // scriptResult = ( require( checkForNodeJSPath ) )();
      // if( scriptResult instanceof _lib.Class.ServerError ) {
      //   pushError( scriptResult.message );
      //   success = false;
      // } else {
      //   _lib.ColorLogger.log( '\tDone' );
      // }
      runScripts( 'Linux' );
      break;
    }
    default: {
      _lib.ColorLogger.log( 'This OS is not yet supported', logStyle.failure );
      break;
    }
  }

  return success
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
  var doAll = _lib.Util.isset( args.A );
  var doDirOnly = _lib.Util.isset( args.D );
  var doFilesOnly = _lib.Util.isset( args.F );
  var doLibOnly = _lib.Util.isset( args.L );
  var missingReqdCmd = !doAll && !doDirOnly && !doLibOnly && !doFilesOnly;
  if( args.h || args.help || missingReqdCmd ) {

    // Show help prompt
    help();
    return;
  }

  // Run setup routine based on user input
  _lib.Util.printEmblem();
  if( doAll || doLibOnly ) {
    setupOSUtils();
  }
  if( doAll || doDirOnly ) {
    setupDirs();
  }
  if( doAll || doFilesOnly ) {
    setupFiles();
  }

  // TODO: Run aftermath summary report (show successes/failues/next steps)
  printSummary();
}

// Run main()
main.call( main, process.argv );
// END main()

// END setup.js
