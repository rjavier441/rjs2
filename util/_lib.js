//	@PROJECT:				rjs2
//	@Name:						R. Javier
//	@File:						_lib.js
//	@Date Created:		2019-10-16
//	@Last Modified:	2019-10-16
//	@Details:
//									A convenience file that bundles all library functions
//	                together
//	@Dependencies:
//									n/a

'use strict';

// BEGIN _Lib (Singleton)
const _Lib = {

  // Top-Level Libraries
  settings: require( './settings.js' ),
  ApiLegend: require( './api_legend.js' ),
  AutoLoader: require( './route_autoloader.js' ),
  ColorLogger: require( './colorLogger.js' ),
  DateTimes: require( './datetimes.js' ),
  Logger: require( './logger.js' ),
  SslManager: require( './sslManager.js' ),
  Util: require( './util.js' ),
  
  // rjs Classes
  Class: {
    HandlerTag: require( './class/handlerTag.js' ),
    ServerError: require( './class/serverError.js' ),
    ServerResponse: require( './class/serverResponse.js' )
  }
};
Object.freeze( _Lib );
// END _Lib (Singleton)

module.exports = _Lib;

// END _lib.js
