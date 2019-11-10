//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					dependencyInjectee.js
//	@Date Created:	2019-11-06
//	@Last Modified:	2019-11-06
//	@Details:
//									Defines a general class that does nothing more than enable
//	                dependency injection for all child classes.
//	@Dependencies:
//									[Insert Dependency here]

'use strict';

// BEGIN class DependencyInjectee
class DependencyInjectee {

  // @ctor
  // @parameters		(object) deps         An object containing references to the
  //	                                    class's dependencies. See the child
  //	                                    class's file header for a list of
  //	                                    dependencies.
  constructor( deps ) {
    
    // Set dependencies
    this._dep = {};
    Object.keys( deps ).forEach( ( key ) => {
      this._dep[key] = deps[key];
    } );
  }
}
// END class DependencyInjectee

module.exports = DependencyInjectee;

// END dependencyInjectee.js
