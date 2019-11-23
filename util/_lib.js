//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					_lib.js
//	@Date Created:	2019-10-16
//	@Last Modified:	2019-10-16
//	@Details:
//									A convenience file that bundles all library functions
//	                together
//	@Dependencies:
//									n/a

'use strict';

// BEGIN _Lib (Singleton)
const _Lib = require( './_lib_optin.js' )._optin();
Object.freeze( _Lib );
// END _Lib (Singleton)

module.exports = _Lib;

// END _lib.js
