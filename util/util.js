//	@PROJECT:				rjs2
//	@Name:						R. Javier
//	@File:						util.js
//	@Date Created:		2019-10-17
//	@Last Modified:	2019-10-18
//	@Details:
//									Defines general utility functions.
//	@Dependencies:
//									n/a

'use strict';

// BEGIN includes
var settings = require( './settings.js' );
var fs = require( 'fs' );
// END includes

// BEGIN Util (Singleton)
const Util = {
  // @function			getPlatform()
  // @description		This function determines which platform this server is on.
  // @parameters		n/a
  // @returns				(string) os         The Operating System of this machine, or
  //	                                  'unsupported' if the Operating System is
  //	                                  not officially supported by rjs2.
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
  // @parameters		(mixed) target      The value whose definition is checked.
  // @returns				(bool) result       The existence of the provided target.
  isset: function( target ) {
    return typeof target !== 'undefined';
  },

  // @function			printEmblem()
  // @description		This function prints the emblem for the server.
  // @parameters		n/a
  // @returns				n/a
  printEmblem: function() {
    console.log( '\n' + fs.readFileSync( `${settings.util}/common/emblem.txt` ).toString() );
  }
};
// END Util (Singleton)

module.exports = Util;

// END util.js
