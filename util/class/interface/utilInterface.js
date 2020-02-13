//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					utilInterface.js
//	@Date Created:	2020-02-11
//	@Last Modified:	2020-02-11
//	@Details:
//									Defines an Interface for the rjs2 utility class Util.
//	@Dependencies:
//									JavaScript ECMAscript6

'use strict';

// BEGIN includes
const DependencyInjectableInterface = require(
  './dependencyInjectableInterface.js'
);
// END includes

// BEGIN class UtilInterface
class UtilInterface extends DependencyInjectableInterface {

  // @ctor
  // @parameters		(~object) deps        An object containing references to the
  //	                                    class's dependencies. See the child
  //	                                    class's file header for a list of
  //	                                    dependencies.
  constructor( deps = {} ) {

    let contract = {
      methods: [
        'getCompatiblePath',
        'getPlatform',
        'isset',
        'printEmblem',
        'trimLeadingSlash',
        'trimSlashes',
        'trimTrailingSlash'
      ],
      props: []
    };
    super( contract, deps );
  }
}
// END class UtilInterface

module.exports = UtilInterface;

// END utilInterface.js
