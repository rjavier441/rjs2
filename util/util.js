//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					util.js
//	@Date Created:	2019-10-17
//	@Last Modified:	2020-02-01
//	@Details:
//									Defines general utility functions.
//	@Dependencies:
//									n/a

'use strict';

// BEGIN includes
const _lib = require( './_lib_optin.js')._optin( [
  'settings'
] );
const fs = require( 'fs' );
// END includes

// BEGIN Util (Singleton)
const Util = {
  // @function			getCompatiblePath()
  // @description		Transforms the given path string to a compatible path string
  //	              for the given OS.
  // @parameters		(string) path         The path string convert.
  //	              (string) os           A string representing the machine's
  //	                                    operating system. Taken from a call
  //	                                    to Util.getPlatform().
  // @returns				(string) result       A new string with path slashes changed
  //	                                    to appropriate slashes for the given
  //	                                    OS.
  getCompatiblePath: function( path, os ) {

    let result;
    switch( os ) {
      case 'Windows': {
        result = path.replace( /\//gi, '\\' );
        break;
      }
      default: {
        result = path.replace( /\\/gi, '/' );
        break;
      }
    }

    return result;
  },

  // @function			getPlatform()
  // @description		This function determines which platform this server is on.
  // @parameters		n/a
  // @returns				(string) os           The Operating System of this machine,
  //	                                    or 'unsupported' if the Operating
  //	                                    System is not officially supported by
  //	                                    rjs2.
  getPlatform: function() {

    var osname = 'unsupported';
    switch( process.platform ) {
      case "darwin": {
        osname = 'MacOS';
        break;
      }
      case "win32": {
        osname = 'Windows';
        break;
      }
      case "linux": {
        osname = "Linux";
        break;
      }
    }

    return osname;
  },

  // @function			isset()
  // @description		Determines if a value is set (i.e. type is not "undefined").
  // @parameters		(mixed) target        The value whose definition is checked.
  // @returns				(bool) result         The existence of the provided target.
  isset: function( target ) {
    return typeof target !== 'undefined';
  },

  // @function			printEmblem()
  // @description		This function prints the emblem for the server.
  // @parameters		n/a
  // @returns				n/a
  printEmblem: function() {
    console.log( '\n' + fs.readFileSync(
      `${_lib.settings.util ? _lib.settings.util : __dirname }/common/emblem.txt`
    ).toString() );
  },

  // @function			trimLeadingSlash()
  // @description		This function trims leading forward slashes from a string.
  // @parameters		(string) input        The string to trim.
  // @returns				(string) result       The resulting string.
  trimLeadingSlash: function( input ) {

    let result = input;
    if( result.length > 0 && result[0] === '/' ) {
      result = result.substring( 1 );
    }

    return result;
  },

  // @function			trimSlashes()
  // @description		This function trims trailing and leading forward slashes
  //	              from a string.
  // @parameters		(string) input        The string to trim.
  // @returns				(string) result       The resulting string.
  trimSlashes: function( input ) {

    let result = input;
    if( result.length > 0 && result[0] === '/' ) {
      result = result.substring( 1 );
    }
    if( result.length > 0 && result[result.length - 1] === '/' ) {
      result = result.substring( 0, result.length - 1 );
    }

    return result;
  },

  // @function			trimTrailingSlash()
  // @description		This function trims trailing forward slashes from a string.
  // @parameters		(string) input        The string to trim.
  // @returns				(string) result       The resulting string.
  trimTrailingSlash: function( input ) {

    let result = input;
    if( result.length > 0 && result[result.length - 1] === '/' ) {
      result = result.substring( 0, result.length - 1 );
    }

    return result;
  }
};
// END Util (Singleton)

module.exports = Util;

// END util.js
