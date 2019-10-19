//	PROJECT:				rjs2
//	Name:						R. Javier
//	File:						checkForNodeJS.js
//	Date Created:		2019-10-19
//	Last Modified:	2019-10-19
//	Details:
//									Defines a NodeJS verification routine for Linux.
//	Dependencies:
//									NodeJS v8+

'use strict';

// BEGIN includes
var _lib = require( '../../../../_lib.js' );
var cp = require( 'child_process' );
// END includes

// BEGIN script
// @function			script()
// @description		The script to run when checking for NodeJS in Linux
// @parameters		n/a
// @returns				(mixed) result        The result of the script. If successful,
//	                                    bool true is returned. If unsuccessful,
//	                                    a ServerError object is returned.
function script() {
  var result = true;

  _lib.ColorLogger.log( 'Checking for NodeJS...' );
  try {
  
    // // DEBUG
    // _lib.ColorLogger.log( "\t" +
    //   parseInt( cp.execSync( 'node -v', {
    //     encoding: 'utf8',
    //     timeout: 30000  // 30 sec
    //   } ).split( '.' )[0].substring(1) ),
    //   { color: 'Yellow' }
    // );
  
    // Check NodeJS version
    var versionStr = cp.execSync( 'node -v', {
      encoding: 'utf8',
      timeout: 10000  // 10 sec
    } );
    var versionNumbers = versionStr.split( '.' );
    var majorVersion = parseInt( versionNumbers[0].substring(1) );
    var minorVersion = parseInt( versionNumbers[1] );
    var revisionVersion = parseInt( versionNumbers[2] );
    var versionErrStr = 'NodeJS v8+ is required';
    _lib.ColorLogger.log( `\t${versionStr}`, {color:'Yellow'} );
    if(
      ( majorVersion < 8 ) ||
      ( majorVersion === 8 && minorVersion < 9 ) ||
      ( majorVersion === 8 && minorVersion === 9 && revisionVersion < 1 )
    ) {
      // pushError( versionErrStr );
      result = new _lib.Class.ServerError( versionErrStr );
    }
  } catch( exception ) {  // instanceof Error = true
  
    // // DEBUG
    // _lib.ColorLogger.log( "exception keys: " + Object.keys( exception ) );
    // _lib.ColorLogger.log( "status:" + exception.status );
    // _lib.ColorLogger.log( "signal:" + exception.signal );
    // _lib.ColorLogger.log( "output:" + exception.output );
    // _lib.ColorLogger.log( "pid:" + exception.pid );
    // _lib.ColorLogger.log( "stdout:" + exception.stdout );
    // _lib.ColorLogger.log( "stderr:" + exception.stderr );
    result = new _lib.Class.ServerError( 'NodeJS is not installed!' );
  }
  _lib.ColorLogger.log( '\tDone' );

  return result;
}
// END script

module.exports = script;

// END checkForNodeJS.js
