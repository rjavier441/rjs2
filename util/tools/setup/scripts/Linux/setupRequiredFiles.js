//	@PROJECT:				rjs2
//	@Name:				  R. Javier
//	@File:					setupRequiredFiles.js
//	@Date Created:	2019-10-22
//	@Last Modified:	2019-10-22
//	@Details:
//									Defines a setup script that creates the required files to
//	                enable the server to run on a Linux OS. This script SHOULD
//	                NOT be executed before setupRequiredDirs.js!
//	@Dependencies:
//									NodeJS v8+

'use strict';

// BEGIN includes
var _lib = require( '../../../../_lib.js' );
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
    h1: { theme: 'primary', style: [ 'bold' ] }
  };
  var defaultTemplateDir = '../../res/defaults/files';
  var req = require( '../../res/required.json' );
  var result = true;

  _lib.ColorLogger.log(
    'Creating default files to enable server operation...',
    logStyle.h1
  );
  try {
    
    // Check all required files
    req.file.forEach( function( filepathFromServerRoot ) {

      var fullpath = `${_lib.settings.serverPath}/${filepathFromServerRoot}`;
      var filename = filepathFromServerRoot.split('/').pop();
      var defaultTemplateFilePath = `${defaultTemplateDir}/${filename}`;
      _lib.ColorLogger.log( `Checking ${fullpath}...`);
      if( !fs.existsSync( fullpath ) ) {

        // Ensure default template file exists
        if( !fs.existsSync( defaultTemplateFilePath ) ) {
          throw `Default template file '${defaultTemplateFilePath}' not found!`;
        }

        // Create file only if it doesn't already exist
        _lib.ColorLogger.log(`\tCreating ${fullpath} from default template...`);
        fs.copyFileSync(
          defaultTemplateFilePath,
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
