//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					configSecurity.js
//	@Date Created:	2019-11-28
//	@Last Modified:	2019-11-28
//	@Details:
//									Defines a script that configures security.json.
//	@Dependencies:
//									n/a

'use strict';

// BEGIN includes
const _lib = require( '../../../../_lib_optin.js' )._optin( [
  'settings',
  'ColorLogger'
] );
const readline = require( 'readline' );
// END includes

// @function      script()
// @description   This function defines the script to run.
// @parameters    (function) resolve    The resolve function passed to a JS
//                                      Promise function.
//                (function) reject     The reject function passed to a JS
//                                      Promise function.
// @returns       n/a
function script( resolve, reject ) {

  var result = true;
  const rl = readline.createInterface( {
    input: process.stdin,
    output: process.stdout,
  } );

  _lib.ColorLogger.log( 'Configuring security.json', {
    theme: 'primary',
    style: ['bold']
  } );

  rl.question( 'Run next? (Y/n): ', ( answer ) => {

    if( answer.toLowerCase() === 'y' ) {
      resolve();
    } else {
      reject( 'Cancelled' );
    }

    // Close stream to avoid recursive stream reading.
    rl.close();
  } );
}

module.exports = { script };

// END configSecurity.js
