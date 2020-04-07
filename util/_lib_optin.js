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
//	@Note           Some libraries (e.g. SslManager) cause issues during loading
//	                of the library outside a running server process (e.g. a unit
//	                test, the setup script, etc.).

'use strict';

// BEGIN _Lib (const reference)
const _Lib = {

  // Top-Level Libraries
  settings: __dirname + '/settings.js',
  AccessControl: __dirname + '/accessControl.js',
  ApiLegend: __dirname + '/api_legend.js',
  AutoLoader: __dirname + '/autoloader.js',
  ColorLogger: __dirname + '/colorLogger.js',
  Cryptic: __dirname + '/cryptic.js',
  DateTimes: __dirname + '/datetimes.js',
  Logger: __dirname + '/logger.js',
  MysqlUtil: __dirname + '/mysqlUtil.js',
  StaticAutoLoader: __dirname + '/static_autoloader.js',
  SslManager: __dirname + '/sslManager.js',
  TemplateManager: __dirname + '/templateManager.js',
  Util: __dirname + '/util.js',
  
  // rjs Classes
  Class: {
    HandlerTag: __dirname + '/class/handlerTag.js',
    ServerError: __dirname + '/class/serverError.js',
    ServerResponse: __dirname + '/class/serverResponse.js'
  },

  // Metadata
  _meta: {
    _ignore: [ '_optin', '_meta' ]
  }
};
// END _Lib (const reference)


// BEGIN _Lib utilities
// @function			_optin()
// @description		Automatically opts in the specified libraries and utilities.
// @parameters		(~string[]) libs      A list of the desired libraries to
//	                                    opt into. Must be a valid key within
//	                                    the existing set of library names
//	                                    above. If omitted, all libraries are
//	                                    opted into.
// @returns				n/a
_Lib._optin = function( libs = false ) {
  
  // Determine list of libraries to include
  var whitelist = [];
  if( libs && Array.isArray(libs) ) {
    whitelist = libs;
  } else {
    whitelist = Object.keys(_Lib);

    // Remove keys to ignore
    this._meta._ignore.forEach( function( libToIgnore ) {

      if( whitelist.includes( libToIgnore ) ) {
        whitelist.splice( whitelist.indexOf( libToIgnore ), 1 );
      }
    } );
  }

  // Generate requested library collection
  var libraryCollection = {};
  whitelist.forEach( function( libToInclude ) {

    // TODO: Add checks to make sure the libToInclude exists.

    // Handle any nested library requests
    if( libToInclude === 'Class' ) {

      // Handles general Class inclusion directive
      if( typeof libraryCollection.Class === 'undefined' ) {
        libraryCollection.Class = {};
      }

      Object.keys(_Lib.Class).forEach( function( classToInclude ) {
        libraryCollection[libToInclude][classToInclude] = require(
          _Lib[libToInclude][classToInclude]
        );
      } );
    } else if( libToInclude.indexOf( 'Class.' ) === 0 ) {

      // Handles individual Class inclusions
      var className = libToInclude.substring( libToInclude.indexOf('.') + 1 );
      if( typeof libraryCollection.Class === 'undefined' ) {
        libraryCollection.Class = {};
      }
      libraryCollection.Class[className] = require( _Lib.Class[className] );
    } else {

      // Handles top-level library inclusions
      libraryCollection[libToInclude] = require( _Lib[libToInclude] );
    }
  } );

  return libraryCollection;
};
// END _Lib utilities

module.exports = _Lib;

// END _lib_optin.js
