//	PROJECT:				rjs2
//	Name:						R. Javier
//	File:						util.js
//	Date Created:		2019-10-17
//	Last Modified:	2019-10-17
//	Details:
//									Defines general utility functions.
//	Dependencies:
//									n/a

'use strict';

// BEGIN includes
var settings = require( './settings.js' );
var fs = require( 'fs' );
// END includes

// BEGIN Util (Singleton)
const Util = {
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
