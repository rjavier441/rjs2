//	PROJECT:				rjs2
//	Name:						R.Javier
//	File:						handlerTag.js
//	Date Created:		2019-10-06
//	Last Modified:	2019-10-06
//	Details:
//									Defines a class from which a logger module can extract
//	                function details.
//	Dependencies:
//									n/a

"use strict";

// BEGIN class HandlerTag
class HandlerTag {

  // @ctor
  // @parameters    (function) ref      A reference to the function caller
  constructor( ref ) {
    // TODO: get a function's name 
    this.fname = ref.name;
  }

  // @function			getTag()
  // @description		Acquires a handler tag string for this function.
  // @parameters		n/a
  // @returns				(string) tag        The handler tag string
  getTag() {
    return this.fname;
  }
}
// END class HandlerTag

module.exports = HandlerTag;

// END handlerTag.js