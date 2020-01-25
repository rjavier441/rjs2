//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					checkForNpm.js
//	@Date Created:	2020-01-24
//	@Last Modified:	2020-01-24
//	@Details:
//									Defines a Node Package Manager verification routine for
//	                Windows.
//	@Dependencies:
//									NodeJS v8+

'use strict';

// BEGIN includes
const _lib_optin = require( '../../../../_lib_optin.js' );
const _lib = {
  // Top-Level Libraries
  settings: require( _lib_optin.settings ),
  ApiLegend: require( _lib_optin.ApiLegend ),
  AutoLoader: require( _lib_optin.AutoLoader ),
  ColorLogger: require( _lib_optin.ColorLogger ),
  DateTimes: require( _lib_optin.DateTimes ),
  Logger: require( _lib_optin.Logger ),
  Util: require( _lib_optin.Util ),
  
  // rjs Classes
  Class: {
    HandlerTag: require( _lib_optin.Class.HandlerTag ),
    ServerError: require( _lib_optin.Class.ServerError ),
    ServerResponse: require( _lib_optin.Class.ServerResponse )
  }
};
const cp = require( 'child_process' );
// END includes

// BEGIN script
// @function			script()
// @description		The script to run
// @parameters		n/a
// @returns				(mixed) result        The result of the script. If successful,
//	                                    bool true is returned. If unsuccessful,
//	                                    a ServerError object is returned.
function script() {
  var result = true;

  _lib.ColorLogger.log( "Checking Node Package Manager...", {
    theme: 'primary',
    style: ['bold']
  } );
  try {

    // Check for NPM v6+
    var versionStr = cp.execSync( 'npm -v', {
      encoding: 'utf8',
      timeout: 10000  // 10 sec
    } );
    var majorVersion = parseInt( versionStr.split( '.' )[0] );
    _lib.ColorLogger.log( `\t${versionStr}`, {color: 'Yellow'} );
    if( majorVersion < 6 ) {
      result = new _lib.Class.ServerError( `NPM v6+ is required` );
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
    // console.log( exception );

    // Return ServerError
    result = new _lib.Class.ServerError( 'NPM is not installed!' );
  }
  _lib.ColorLogger.log( '\tDone' );

  return result;
}
// END script

module.exports = script;

// END checkForNpm.js
