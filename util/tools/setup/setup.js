//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					setup.js
//	@Date Created:	2019-10-16
//	@Last Modified:	2019-10-18
//	@Details:
//									A setup utility to enable server setup
//	@Dependencies:
//									NodeJS v8+

'use strict';

// BEGIN includes
var _lib = require( '../../_lib.js' );
var fs = require( 'fs' );
var minimist = require( 'minimist' );
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
//	                                    corresponding operating system.
//	              (string[]) scriptList A list of script names to run. If given,
//	                                    the scripts in the list are executed in
//	                                    order.
// @returns				n/a
function runScripts( os, scriptList = false ) {
  var scriptsDir = `${__dirname}/scripts/${os}`;
  var scriptSequence = false;

  // Read script directory to determine list of scripts to run
  var files = fs.readdirSync( scriptsDir );
  if( scriptList ) {
    scriptSequence = scriptList;
  } else if( files.includes( 'order.json' ) ) {
    scriptSequence = JSON.parse(
      fs.readFileSync( `${scriptsDir}/order.json` )
    ).order;
  } else {
    scriptSequence = files;
  }

  // Traverse script sequence in order
  scriptSequence.forEach( function( filename ) {

    // Skip the boilerplate
    if( filename === 'boilerplateSetupScript.js' ) {
      return;
    }

    // Ensure script exists
    var filepath = `${scriptsDir}/${filename}`;
    if( !fs.existsSync( filepath ) ) {

      pushError( `"${filepath}" not found!` );
    } else {

      var scriptResult = ( require( filepath ) )();
      if( scriptResult instanceof _lib.Class.ServerError ) {
        pushError( scriptResult.message );
      }
    }
  } );

  // DEBUG
  // _lib.ColorLogger.log( scriptSequence.toString(), );
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
  var executionList = false;
  _lib.Util.printEmblem();
  if( doLibOnly ) {
    executionList = [
      'checkForNodeJS.js',
      'checkForNpm.js'
    ];
  }
  if( doDirOnly ) {
    executionList = [ 'setupRequiredDirs.js' ];
  }
  if( doFilesOnly ) {
    executionList = [ 'asdf.js' ];
  }
  runScripts( _lib.Util.getPlatform(), executionList );

  // Run aftermath summary report (show successes/failues/next steps)
  printSummary();
}

// Run main()
main.call( main, process.argv );
// END main()

// END setup.js
