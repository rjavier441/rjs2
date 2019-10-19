//	@PROJECT:				rjs2
//	@Name:						R. Javier
//	@File:						serverError.js
//	@Date Created:		2019-10-13
//	@Last Modified:	2019-10-13
//	@Details:
//									Defines a class from which errors can be consistently
//	                described to the client side.
//	@Dependencies:
//									n/a

'use strict';

// BEGIN class ServerError
class ServerError extends Error {

  // @ctor
  // @parameters    (string) message    The message describing the error.
  //	              (~object) eobj      An object passing along data to describe
  //	                                  the error
  //                (~number) ecode     The error code.
  //	              (~string) name      The name of the error.
  //	              (~Date) ts          A timestamp to mark error occurrence.
  constructor(
    message,
    eobj = {},
    ecode = 500,
    name = 'Internal Server Error',
    ts = new Date( Date.now() )
  ) {
    super();
    this.success = false;
    this.name = name;
    this.message = message;
    this.eobj = eobj;
    this.ecode = ecode;
    this.ts = ts;
  }
}

// @function			asString()
// @description		Generates a string representation of the ServerError instance.
// @parameters		n/a
// @returns				(string) str          The string representation of this obj.
ServerError.prototype.asString = function() {
  return JSON.stringify( this );
};
// END class ServerError

module.exports = ServerError;

// END serverError.js
