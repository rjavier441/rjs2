//	@PROJECT:				rjs2
//	@Name:				  R. Javier
//	@File:					setupSymbolicLinks.js
//	@Date Created:	2019-11-17
//	@Last Modified:	2019-11-17
//	@Details:
//									Script that sets up symbolic links
//	@Dependencies:
//									NodeJS v8+

'use strict';

// BEGIN includes
const _lib = require( '../../../../_lib_optin.js' )._optin( [
  'ColorLogger',
  'settings',
  'Class'
] );
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
  var styles = {
    header: { theme: 'primary', style: ['bold'] }
  };
  var req = require( '../../res/required.json' );
  var result = true;

  _lib.ColorLogger.log( 'Setting up Symbolic links...', styles.header );
  try {

    req.symlink.forEach( ( link ) => {
      var linkFullPath = `${_lib.settings.serverPath}/${link.name}`;
      var destFullPath = `${_lib.settings.serverPath}/${link.destination}`;
      
      // Ensure the link exists
      _lib.ColorLogger.log( `Checking for ${linkFullPath}` );
      if( !fs.existsSync( destFullPath ) ) {
        throw new Error(
          `Destination doesn't exist: ${destFullPath}\n` +
          'Did you run `npm install` and install all dependencies?'
        );
      } else if( !fs.existsSync( linkFullPath ) ) {

        _lib.ColorLogger.log( `\tCreating link ${linkFullPath}...` );
        fs.linkSync( destFullPath, linkFullPath );
        _lib.ColorLogger.log( '\t\tDone' );
      }

      _lib.ColorLogger.log( '\tDone' );
    } );

  } catch( exception ) {  // instanceof Error = true
  
    // DEBUG
    _lib.ColorLogger.log( 'exception keys: ' + Object.keys( exception ) );
    _lib.ColorLogger.log( 'status:' + exception.status );
    _lib.ColorLogger.log( 'signal:' + exception.signal );
    _lib.ColorLogger.log( 'output:' + exception.output );
    _lib.ColorLogger.log( 'pid:' + exception.pid );
    _lib.ColorLogger.log( 'stdout:' + exception.stdout );
    _lib.ColorLogger.log( 'stderr:' + exception.stderr );

    // Return ServerError
    result = new _lib.Class.ServerError(
      `Failed to setup symbolic links: ${exception.toString()}`
    );
  }

  return result;
}
// END script

module.exports = script;

// END setupSymbolicLinks.js
