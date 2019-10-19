//	PROJECT:				rjs2
//	Name:						[author]
//	File:						[filename]
//	Date Created:		[dateCreated]
//	Last Modified:	[dateCreated]
//	Details:
//									[desc]
//	Dependencies:
//									NodeJS v8+

'use strict';

// BEGIN includes
var _lib = require( '../../../../_lib.js' );
// Include other libraries here...
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

  _lib.ColorLogger.log( "[Describe script's main purpose]..." );
  try {

    // Begin script source code here...

  } catch( exception ) {  // instanceof Error = true
  
    // DEBUG
    _lib.ColorLogger.log( "exception keys: " + Object.keys( exception ) );
    _lib.ColorLogger.log( "status:" + exception.status );
    _lib.ColorLogger.log( "signal:" + exception.signal );
    _lib.ColorLogger.log( "output:" + exception.output );
    _lib.ColorLogger.log( "pid:" + exception.pid );
    _lib.ColorLogger.log( "stdout:" + exception.stdout );
    _lib.ColorLogger.log( "stderr:" + exception.stderr );

    // Return ServerError
    result = new _lib.Class.ServerError( 'NodeJS is not installed!' );
  }
  _lib.ColorLogger.log( '\tDone' );

  return result;
}
// END script

module.exports = script;

// END [filename]
