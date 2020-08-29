//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					apiUtilInterface.js
//	@Date Created:	2020-08-04
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

// BEGIN class ApiUtilInterface
class ApiUtilInterface extends DependencyInjectableInterface {

  // @ctor
  // @parameters		(~object) deps        An object containing references to
  //                                      the class's dependencies. See the
  //                                      child class's file header for a
  //                                      list of dependencies.
  constructor( deps = {} ) {

    let contract = {
      methods: [
        'initApiSession'
      ],
      props: []
    };
    super( contract, deps );
  }
}
// END class ApiUtilInterface

module.exports = ApiUtilInterface;

// END apiUtilInterface.js
