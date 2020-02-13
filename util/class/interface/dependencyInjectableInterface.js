//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					dependencyInjectableInterface.js
//	@Date Created:	2020-02-11
//	@Last Modified:	2020-02-11
//	@Details:
//									Defines an Interface for classes and interfaces that need
//	                to be dependency-injectable. Serves as a carbon copy of the
//	                class DependencyInjectee mixed-in with class BaseInterface.
//	@Dependencies:
//									JavaScript ECMAscript6

'use strict';

// BEGIN includes
const BaseInterface = require( './baseInterface.js' );
// END includes

// BEGIN class DependencyInjectableInterface
class DependencyInjectableInterface extends BaseInterface {

  // @ctor
  // @parameters		(object) contract     An object describing the requirements
  //	                                    for a child interface of this class.
  //	                                    For details on what to pass to this
  //	                                    parameter, see the class BaseInterface
  //	                                    documentation.
  //	              (~object) deps        An object containing references to the
  //	                                    class's dependencies. See the child
  //	                                    class's file header for a list of
  //	                                    dependencies.
  constructor( contract, deps = {} ) {
    super( contract );

    // Set dependencies
    this._dep = {};
    Object.keys( deps ).forEach( ( key ) => {
      this._dep[key] = deps[key];
    } );
  }
}
// END class DependencyInjectableInterface

module.exports = DependencyInjectableInterface;

// END dependencyInjectableInterface.js
