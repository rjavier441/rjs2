//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					boilerplate/app/app.js
//	@Date Created:	2019-12-02
//	@Last Modified:	2019-12-02
//	@Details:
//									Defines the application routing logic for application
//                  'boilerplate'.
//	@Dependencies:
//									N/a

'use strict';

// BEGIN includes
const _lib = require( '../../../util/_lib.js' );
const express = require( 'express' );
const bp = require( 'body-parser' );
const routes = require( './routes' );
// END includes

// BEGIN mapper
// @function			mapper()
// @description		? 
// @parameters		?
// @returns				?
function mapper() {

  // Initialize app
  const app = express();
  app.use( bp.json( {       // support JSON-encoded request body
    strict: true
  } ) );
  app.use( bp.urlencoded( { // support JSON-encoded request body
    extended: true
  } ) );

  // Get this route's name
  var tokens = __dirname.split( '/' );
  var routeName = tokens[ tokens.length - 2 ];
  var ht = { src: `${routeName}` };
  _lib.Logger.log( `Mapping ${routeName}`, ht );

  // Map routes router to this endpoint's root URI
  app.use( '/', routes );

  // Return app reference
  return app;
}
// END mapper

// Run the mapper
module.exports = mapper();

// END boilerplate/app/app.js
