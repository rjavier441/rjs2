//	@PROJECT:				rjs2
//	@Name:				  R. Javier
//	@File:					createSudoSymbolicLinks.js
//	@Date Created:	2019-10-27
//	@Last Modified:	2019-10-27
//	@Details:
//									Defines a Linux-specific routine to handle a nodejs/npm
//	                access issue when using the setup script with 'sudo', which
//	                causes the _lib library to fail when it requires a module
//	                that needs access to restricted content (e.g. SslManager
//	                when it requires the CA certificate keys).
//	@Dependencies:
//									NodeJS v8+

'use strict';

// BEGIN includes
const _lib_optin = require( '../../../../_lib_optin.js' );
const _lib = {
  ColorLogger: require( _lib_optin.ColorLogger ),
  Class: {
    HandlerTag: require( _lib_optin.Class.HandlerTag ),
    ServerError: require( _lib_optin.Class.ServerError )
  }
};
const cp = require( 'child_process' );
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
  var result = true;

  _lib.ColorLogger.log( 'Creating library symbolic links...', {
    theme: 'primary',
    style: ['bold']
  } );
  try {

    // sudo ln -s /usr/local/bin/node /usr/bin/node
    // sudo ln -s /usr/local/lib/node /usr/lib/node
    // sudo ln -s /usr/local/bin/npm /usr/bin/npm
    // sudo ln -s /usr/local/bin/node-waf /usr/bin/node-waf

    // Check if the symlinks already exist
    var nonexistentFiles = [];
    var requiredLinkMap = {
      "/usr/bin/node": cp.execSync(
        'sudo which "$(which node)"', {encoding: 'utf8'}
      ),
      "/usr/bin/npm": cp.execSync(
        'sudo which "$(which npm)"', {encoding: 'utf8'}
      )
    };
    Object.keys( requiredLinkMap ).forEach( function( key ) {

      // DEBUG
      console.log( 'fs.existsSync( src ):', fs.existsSync( src ) );

      // Don't create a symlink unless the source file exists
      var src = requiredLinkMap[key];
      var dest = key;
      if( fs.existsSync( src ) ) {

        if( !fs.existsSync( dest ) ) {
  
          var cmdOutput = cp.execSync( `sudo ln -s ${src} ${dest}` );
        }
      } else {
        nonexistentFiles.push( src );
      }
    } );

    if( nonexistentFiles.length > 0 ) {
      result = new _lib.Class.ServerError(
        `Missing libraries: ${nonexistentFiles.toString()}`
      );
    }
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
    result = new _lib.Class.ServerError( `Unable to create symbolic links: ${exception}` );
  }
  _lib.ColorLogger.log( '\tDone' );

  return result;
}
// END script

module.exports = script;

// END createSudoSymbolicLinks.js
