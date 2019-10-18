//	PROJECT:				rjs2
//	Name:						R. Javier
//	File:						serverResponse.js
//	Date Created:		2019-10-13
//	Last Modified:	2019-10-13
//	Details:
//									Defines a class from which server responses can be
//	                consistently structured for the client side.
//	Dependencies:
//									n/a

'use strict';

// BEGIN class ServerResponse
class ServerResponse {

  // @ctor
  // @parameters    (~string) message   The message describing the response.
  //	              (~number) code      The status flag that can be used to
  //	                                  describe the success of an operation.
  //	              (~object) data      An object containing data to pass to the
  //	                                  client.
  //	              (~Date) ts          A timestamp to mark response creation.
  constructor(
    message = '',
    success = true,
    data = null,
    ts = new Date( Date.now() )
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.ts = ts;
  }
}

// @function			asString()
// @description		Generates string representation of the ServerResponse instance
// @parameters		n/a
// @returns				(string) str          The string representation of this obj.
ServerResponse.prototype.asString = function() {
  return JSON.stringify( this );
};
// END class ServerResponse

module.exports = ServerResponse;

// END serverResponse.js
