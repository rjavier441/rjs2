//	@PROJECT:				  rjs2
//	@Name:						R.Javier
//	@File:						handlerTag.js
//	@Date Created:		2019-10-06
//	@Last Modified:	  2019-11-01
//	@Details:
//									  Defines a class from which a logger module can extract
//	                  function details.
//	@Dependencies:
//									  n/a
//  NOTE: Creating functions as class prototypes allows them to be loaded only
//        once in memory, thereby being more conservative on RAM

"use strict";

// BEGIN class HandlerTag
class HandlerTag {

  // @ctor
  // @parameters    (function) ref      A reference to the function caller
  //	              (~string) type      Indicates the type of entity from which
  //	                                  the handler tag is being generated,
  //	                                  enabling control over where tag members
  //	                                  are acquired. If omitted, this defaults
  //	                                  to 'function'. Supported types include:
  //
  //                                    'function'      For any normal function.
  //	                                  'api'           For an API Endpoint.
  constructor( ref, type = 'function' ) {

    // Define Public Properties
    this.addNL = true;
    this.fname = null;
    this.padding = 0;   // newline padding between a comment and previous
                        // cursor
    this.type = type;

    switch( type ) {
      case 'api': {
        var endpointMethod = ref._meta.endpoint.method;
        var endpointParentRouteName = ref._meta.apilegend.name +
          ref._meta.endpoint.route;
        this.fname = `(${endpointMethod}) ${endpointParentRouteName}`;
        break;
      }
      case 'function': {
        this.fname = ref.name;
        break;
      }
      default: {
        break;
      }
    }
  }
}

// @function			getTag()
// @description		Acquires a handler tag string for this function.
// @parameters		n/a
// @returns				(object) tag          The handler tag object
HandlerTag.prototype.getTag = function() {
  return {
    addNL: this.addNL,
    pad: this.padding,
    src: this.fname,
    type: this.type
  };
};
// END class HandlerTag

module.exports = HandlerTag;

// END handlerTag.js