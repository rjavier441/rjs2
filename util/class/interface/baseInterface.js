//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					baseInterface.js
//	@Date Created:	2020-02-09
//	@Last Modified:	2020-02-09
//	@Details:
//									Defines a base interface class supporting the Interface
//	                software design pattern. This class can be used to create
//	                interfaces for other classes
//	@Dependencies:
//									n/a

// BEGIN Baseinterface Usage Documentation
// @note			    The BaseInterface class was made in an attempt to introduce
//	              the Interface design pattern into rjs2. Its intended use is
//	              as a parent class of a child class (a.k.a child interface) "I"
//	              whose only objective is to pass in a contract to the "super()"
//	              function. Then, all child classes of "I" will conform to the
//	              contract given to by "I" to the inherited BaseInterface parent
//	              class instance. Note that proper use of "I" involves the
//	              following:
//	
//	                1.) All classes "C" extending interface "I" must have
//	                    methods defined in the given interface contract BEFORE
//	                    the constructor of "I" runs.
//	                2.) All classes "C" extending interface "I" must have
//	                    properties defined in the given interface contract
//	                    BEFORE the constructor of "I" runs.
//
//	              This means that functions and properties must exist in "C"'s
//	              prototype in order to be successfully detected by the contract
//	              verification:
//	
//	                class C extendes I {
//                    constructor() {
//	                    super();  // must run first, always
//	                    this.a = function(){...};   // Fails because super will
//	                                                // check "this" before "a"
//	                                                // is added
//	
//	                    this.b = false;             // Fails for the above
//	                                                // reason
//	                  }
//	                  a() {...}                     // Succeeds because this is
//	                                                // added to the prototype
//	                                                // BEFORE super runs
//	                }
//	                C.prototype.b = false;          // Succeeds for the above
//	                                                // reason
// END Baseinterface Usage Documentation

// BEGIN class BaseInterface
class BaseInterface extends Object {

  // @ctor
  // @parameters		(object) contract     An object describing the requirements
  //	                                    for a child interface of this class.
  //	                                    It takes the following members:
  //	                (~string[]) methods   An array of function names for the
  //	                                      required functions of a child of
  //	                                      this class.
  //	                (~string[]) props     An array of property names for the
  //	                                      required properties of a child of
  //	                                      this class.
  constructor( contract ) {
    
    super();
    this.__$interfaceContract = contract;

    // Run contract verification
    this.__$verifyInterfaceContract();
  }

  // @function			__$verifyInterfaceContract()
  // @description		Verifies the integrity of the interface contact, i.e. checks
  //	              to make sure the child class of this interface instance
  //	              conforms to the contract set by verifying the existence of
  //	              the methods and properties in the given contract. Throws an
  //	              error on a contract's violation
  // @parameters		n/a
  // @returns				n/a
  __$verifyInterfaceContract() {
    
    // Check for method contract conformity
    if( Array.isArray( this.__$interfaceContract.methods ) ) {
      
      this.__$interfaceContract.methods.forEach( ( methodName ) => {

        if( typeof this[methodName] === 'undefined' ) {
          throw new Error( `Undefined interface method ${this.constructor.name}.${methodName}` );
        }
      } );
    }
    
    // Check for property contract conformity
    if( Array.isArray( this.__$interfaceContract.props ) ) {
      
      this.__$interfaceContract.props.forEach( ( propName ) => {

        if( typeof this[propName] === 'undefined' ) {
          throw new Error( `Undefined interface prop ${this.constructor.name}.${propName}` );
        }
      } );
    }
  }
}
// END class BaseInterface

module.exports = BaseInterface;

// END baseInterface.js
