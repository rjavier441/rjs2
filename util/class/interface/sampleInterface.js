//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					sampleInterface.js
//	@Date Created:	2020-02-11
//	@Last Modified:	2020-02-11
//	@Details:
//									Defines a sample Interface to serve as a template for all
//	                classes utilizing class BaseInterface as an implementation
//	                of the interface software engineering design pattern.
//	@Dependencies:
//									JavaScript ECMAscript6

'use strict';

// BEGIN includes
const BaseInterface = require( './baseInterface.js' );
// END includes

// BEGIN class SampleInterface
class SampleInterface extends BaseInterface {

  constructor() {

    let contract = {
      methods: [ 'functionA', 'functionB' ],
      props: [ 'a', 'b' ]
    };
    super( contract );
  }
}
// END class SampleInterface

module.exports = SampleInterface;

// END sampleInterface.js
