//	@PROJECT:				rjs2
//	@Name:				  R. Javier
//	@File:					setupRequiredFiles.js
//	@Date Created:	2019-10-22
//	@Last Modified:	2019-10-25
//	@Details:
//									Defines a setup script that creates the required files to
//	                enable the server to run on a Linux OS. This script SHOULD
//	                NOT be executed before setupRequiredDirs.js!
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
const fs = require( 'fs' );
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
    h1: { theme: 'primary', style: [ 'bold' ] }
  };
  var customTemplateDir =
    `${_lib.settings.util}/tools/setup/res/custom/files`;
  var defaultTemplateDir =
    `${_lib.settings.util}/tools/setup/res/defaults/files`;
  var req = require( '../../res/required.json' );
  var result = true;

  _lib.ColorLogger.log(
    'Creating default files to enable server operation...',
    logStyle.h1
  );
  try {
    
    // Check all required files
    req.file.forEach( function( filepathFromServerPath ) {

      var fullpath = `${_lib.settings.serverPath}/${filepathFromServerPath}`;
      var customTemplateFilePath =
        `${customTemplateDir}/${filepathFromServerPath}`;
      var defaultTemplateFilePath =
        `${defaultTemplateDir}/${filepathFromServerPath}`;
      _lib.ColorLogger.log( `Checking ${fullpath}...`);
      if( !fs.existsSync( fullpath ) ) {

        // // DEBUG
        // _lib.ColorLogger.log(
        //   `defaultTemplateFilePath: ${defaultTemplateFilePath}`
        // );

        // Ensure default template file exists
        var foundCustom = false;
        var sourcePath = '';
        if( fs.existsSync( customTemplateFilePath ) ) {
          sourcePath = customTemplateFilePath;
          foundCustom = true;
        }
        else if( fs.existsSync( defaultTemplateFilePath ) ) {
          sourcePath = defaultTemplateFilePath;
        } else {
          throw `Default template file '${defaultTemplateFilePath}' not found!`;
        }

        // Create file only if it doesn't already exist
        _lib.ColorLogger.log( `\tCreating ${fullpath} from ${ foundCustom ?
          'custom' : 'default' } template...`);
        fs.copyFileSync(
          sourcePath,
          fullpath,
          fs.constants.COPYFILE_EXCL
        );
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
      `Failed to setup files: ${ exception.toString() }`
    );
  }

  return result;
}
// END script

module.exports = script;

// END setupRequiredFiles.js
