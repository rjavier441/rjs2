//	@PROJECT:				rjs2
//	@Name:				  R. Javier
//	@File:					installNodeModules.js
//	@Date Created:	2020-01-24
//	@Last Modified:	2020-01-24
//	@Details:
//									Defines Node Module Installation routine for Windows.
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

  _lib.ColorLogger.log( 'Installing Node Modules...', {
    theme: 'primary',
    style: ['bold']
  } );
  try {

    // Install Node Modules
    var output = cp.execSync( `cd ${_lib.settings.serverPath} && npm install`, {
      encoding: 'utf8',
      timeout: 600000 // 600 sec = 10 mins
    } );
    _lib.ColorLogger.log( output );
    _lib.ColorLogger.log( '\tDone' );

  } catch( exception ) {  // instanceof Error = true
  
    // // DEBUG
    // _lib.ColorLogger.log( `exception: ${exception}` );
    // _lib.ColorLogger.log( 'exception keys: ' + Object.keys( exception ) );
    // _lib.ColorLogger.log( 'status:' + exception.status );
    // _lib.ColorLogger.log( 'signal:' + exception.signal );
    // _lib.ColorLogger.log( 'output:' + exception.output );
    // _lib.ColorLogger.log( 'pid:' + exception.pid );
    // _lib.ColorLogger.log( 'stdout:' + exception.stdout );
    // _lib.ColorLogger.log( 'stderr:' + exception.stderr );

    // Return ServerError
    result = new _lib.Class.ServerError(
      `Failed to install Node Modules: ${exception}`
    );
  }

  return result;
}
// END script

module.exports = script;

// END installNodeModules.js
