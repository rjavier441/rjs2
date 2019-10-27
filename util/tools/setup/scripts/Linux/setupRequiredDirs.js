//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					setupRequiredDirs.js
//	@Date Created:	2019-10-19
//	@Last Modified:	2019-10-19
//	@Details:
//									Defines a routine to setup the server's mandatory dirs.
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
var fs = require( 'fs' );
// END includes

// BEGIN script
// @function			script()
// @description		The script to run
// @parameters		n/a
// @returns				(mixed) result        The result of the script. If successful,
//	                                    bool true is returned. If unsuccessful,
//	                                    a ServerError object is returned.
function script() {
  var logStyle = {
    stepHeader: { theme: 'primary', style: [ 'bold' ] }
  };
  var req = require( '../../res/required.json' );
  var result = true;

  _lib.ColorLogger.log(
    "Setting up server file system...",
    logStyle.stepHeader
  );
  try {

    // Check all required directories
    req.dir.forEach( function( pathFromServerRoot ) {

      var fullpath = `${_lib.settings.serverPath}/${pathFromServerRoot}`;
      _lib.ColorLogger.log( `Checking ${fullpath}...` );
      if( !fs.existsSync(fullpath) ) {
        
        _lib.ColorLogger.log( `\tCreating ${fullpath}...` );
        fs.mkdirSync( fullpath );
        _lib.ColorLogger.log( '\t\tDone' );
      }
      _lib.ColorLogger.log( '\tDone' );
    } );

  } catch( exception ) {  // instanceof Error = true
  
    // // DEBUG
    // _lib.ColorLogger.log( "exception keys: " + Object.keys( exception ) );
    // _lib.ColorLogger.log( "status:" + exception.status );
    // _lib.ColorLogger.log( "signal:" + exception.signal );
    // _lib.ColorLogger.log( "output:" + exception.output );
    // _lib.ColorLogger.log( "pid:" + exception.pid );
    // _lib.ColorLogger.log( "stdout:" + exception.stdout );
    // _lib.ColorLogger.log( "stderr:" + exception.stderr );

    // Return ServerError
    result = new _lib.Class.ServerError(
      `Failed to setup directories: ${exception.toString()}`
    );
  }

  return result;
}
// END script

module.exports = script;

// END setupRequiredDirs.js
