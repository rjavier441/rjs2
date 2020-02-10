'use strict';

const BaseInterface = require( './baseInterface.js' );

class SampleInterface extends BaseInterface {

  constructor() {

    let contract = {
      methods: [ 'functionA', 'functionB' ],
      props: [ 'a', 'b' ]
    };
    super( contract );
  }
}

module.exports = SampleInterface;