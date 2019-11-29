//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					[script name]
//	@Date Created:	2019-11-28
//	@Last Modified:	2019-11-28
//	@Details:
//									Defines a script that is placed into the configuration
//                  Promise chain.
//	@Dependencies:
//									n/a

'use strict';

// BEGIN includes
const _lib = require( '../../../../_lib_optin.js' )._optin( [
  'settings',
  'ColorLogger'
] );
// END includes

// BEGIN script
// @function      script()
// @description   This function defines the script to run.
// @parameters    (function) resolve    The resolve function passed to a JS
//                                      Promise function.
//                (function) reject     The reject function passed to a JS
//                                      Promise function.
// @returns       n/a
function script( resolve, reject ) {

  var success = true;

  // Indicate script intent
  _lib.ColorLogger.log( '[script name]', {
    theme: 'primary',
    style: ['bold']
  } );

  // Begin code here

  // Process the result of the script
  if( success === true ) {
    resolve();
  } else {
    reject();
  }
}
// END script

module.exports = { script };

// END [script name]
