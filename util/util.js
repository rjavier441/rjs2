//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					util.js
//	@Date Created:	2019-10-17
//	@Last Modified:	2020-02-13
//	@Details:
//									Defines general utility functions.
//	@Dependencies:
//									n/a

'use strict';

// BEGIN includes
const UtilInterface = require( './class/interface/utilInterface.js' );
const fs = require( 'fs' );
// END includes

// BEGIN class Util (Singleton)
class Util extends UtilInterface {

  // @ctor
  // @parameters		n/a
  constructor() {
    super();
  }

  // @function			getCompatiblePath()
  // @description		Transforms the given path string to a compatible path string
  //	              for the given OS.
  // @parameters		(string) path         The path string convert.
  //	              (string) os           A string representing the machine's
  //	                                    operating system. Taken from a call
  //	                                    to Util.getPlatform(). Valid values
  //	                                    include all valid return values from
  //	                                    Util.getPlatform().
  // @returns				(string) result       A new string with path slashes changed
  //	                                    to appropriate slashes for the given
  //	                                    OS.
  static getCompatiblePath( path, os ) {

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
  }

  // @function			getPlatform()
  // @description		This function determines which platform this server is on.
  // @parameters		(~Process) proc       A reference to the NodeJS process
  //	                                    object. If omitted, the globally
  //	                                    available process object is used.
  // @returns				(string) os           The Operating System of this machine,
  //	                                    or 'unsupported' if the Operating
  //	                                    System is not officially supported by
  //	                                    rjs2.
  static getPlatform( proc = false ) {

    let osname = 'unsupported', p = proc ? proc : process;
    switch( p.platform ) {
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
  }

  // @function			isset()
  // @description		Determines if a value is set (i.e. type is not "undefined").
  // @parameters		(mixed) target        The value whose definition is checked.
  // @returns				(bool) result         The existence of the provided target.
  static isset( target ) {
    return typeof target !== 'undefined';
  }

  // @function			printEmblem()
  // @description		This function prints the emblem for the server.
  // @parameters		n/a
  // @returns				n/a
  static printEmblem() {
    console.log( '\n' + fs.readFileSync(
      `${__dirname}/common/emblem.txt`
    ).toString() );
  }

  // @function			trimLeadingSlash()
  // @description		This function trims leading forward slashes from a string.
  // @parameters		(string) input        The string to trim.
  // @returns				(string) result       The resulting string.
  static trimLeadingSlash( input ) {

    let result = input;
    if( result.length > 0 && result[0] === '/' ) {
      result = result.substring( 1 );
    }

    return result;
  }

  // @function			trimSlashes()
  // @description		This function trims trailing and leading forward slashes
  //	              from a string.
  // @parameters		(string) input        The string to trim.
  // @returns				(string) result       The resulting string.
  static trimSlashes( input ) {

    let result = input;
    if( result.length > 0 && result[0] === '/' ) {
      result = result.substring( 1 );
    }
    if( result.length > 0 && result[result.length - 1] === '/' ) {
      result = result.substring( 0, result.length - 1 );
    }

    return result;
  }

  // @function			trimTrailingSlash()
  // @description		This function trims trailing forward slashes from a string.
  // @parameters		(string) input        The string to trim.
  // @returns				(string) result       The resulting string.
  static trimTrailingSlash( input ) {

    let result = input;
    if( result.length > 0 && result[result.length - 1] === '/' ) {
      result = result.substring( 0, result.length - 1 );
    }

    return result;
  }
};
// END class Util (Singleton)

module.exports = Util;

// END util.js
