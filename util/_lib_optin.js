//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					_lib_optin.js
//	@Date Created:	2019-10-27
//	@Last Modified:	2019-10-27
//	@Details:
//									A convenience file that bundles all library functions
//	                together. This file differs from _lib.js by adopting an opt-
//	                in approach to library references instead of immediately
//	                creating them (which implicitly runs code). This file was
//	                created as a means of avoiding errors when automatically
//	                requiring libraries that required access to restricted
//	                content (e.g. SslManager when including CA certificates and
//	                keys). Use of this library implies that the user must
//	                manually require libraries in their source code, like:
//
//	                const _lib_optin = require( '/path/to/_lib_optin.js' );
//                  const _lib = { Class: {} };
//	                _lib.settings = require( _lib_optin.settings );
//	                _lib.Class.ServerError = require(
//	                  _lib_optin.Class.ServerError
//	                );
//	@Dependencies:
//									n/a

'use strict';

// BEGIN _Lib (const reference)
const _Lib = {

  // Top-Level Libraries
  settings: __dirname + '/settings.js',
  ApiLegend: __dirname + '/api_legend.js',
  AutoLoader: __dirname + '/route_autoloader.js',
  ColorLogger: __dirname + '/colorLogger.js',
  DateTimes: __dirname + '/datetimes.js',
  Logger: __dirname + '/logger.js',
  SslManager: __dirname + '/sslManager.js',
  Util: __dirname + '/util.js',
  
  // rjs Classes
  Class: {
    HandlerTag: __dirname + '/class/handlerTag.js',
    ServerError: __dirname + '/class/serverError.js',
    ServerResponse: __dirname + '/class/serverResponse.js'
  }
};
// END _Lib (const reference)

module.exports = _Lib;

// END _lib_optin.js
