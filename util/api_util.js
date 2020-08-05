//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					api_util.js
//	@Date Created:	2020-08-04
//	@Last Modified:	2020-08-04
//	@Details:
//									Defines general utility functions for API sub apps.
//	@Dependencies:
//									n/a

'use strict';

// BEGIN includes
const ApiUtilInterface = require( './class/interface/apiUtilInterface.js' );
const HandlerTag = require( './class/handlerTag.js' );
// END includes

// BEGIN class ApiUtil (Singleton)
class ApiUtil extends ApiUtilInterface {

  // @ctor
  // @parameters		n/a
  constructor() {
    super();
  }

  // @function			initApiSession()
  // @description		Initializes an API session by performing a common setup
  //                routine for many database connection, message logging,
  //                and ExpressJS response configurations and variables. 
  // @parameters		(reference) ref       A reference to the enclosing lexical
  //                                      context calling this function (i.e
  //                                      the caller's "this" value).
  //                (object) request      The web request object provided by
  //                                      express.js.
  // @returns				(array) sessionVars   The session* variables for use in
  //                                      the current API call.**
  // @notes         *Are they really "session" variables?
  //                **By using JavaScript ES6, you can unpack each array value
  //                  into a distinct variable (assuming you observer order).
  static initApiSession( ref, request ) {
    return [
      Object.assign(request.params, request.body, request.query), // args
      new HandlerTag( ref, 'api' ).getTag(),                      // ht
      false,                                                      // conn
      false                                             // connectionLive
    ];
  }
}
// END class ApiUtil (Singleton)

module.exports = ApiUtil;

// END api_util.js
