//	@PROJECT:				rjs2
//	@Name:						R.Javier
//	@File:						handlerTag.js
//	@Date Created:		2019-10-06
//	@Last Modified:	2019-10-06
//	@Details:
//									Defines a class from which a logger module can extract
//	                function details.
//	@Dependencies:
//									n/a
//  NOTE: Creating functions as class prototypes allows them to be loaded only
//        once in memory, thereby being more conservative on RAM

"use strict";

// BEGIN class HandlerTag
class HandlerTag {

  // @ctor
  // @parameters    (function) ref      A reference to the function caller
  constructor( ref ) {

    // Public Properties
    this.fname = ref.name;
    this.padding = 0;   // newline padding between a comment and previous cursor
    this.addNL = true;
  }
}

// @function			getTag()
// @description		Acquires a handler tag string for this function.
// @parameters		n/a
// @returns				(object) tag          The handler tag object
HandlerTag.prototype.getTag = function() {
  return {
    src: this.fname,
    pad: this.padding,
    addNL: this.addNL
  };
};
// END class HandlerTag

module.exports = HandlerTag;

// END handlerTag.js