'use strict';

const SampleInterface = require( './interface/sampleInterface.js' );

class SampleClassUsingInterface extends SampleInterface {

  constructor() {
    super();
  }

  functionA(){
    console.log('This is functionA');
  }
  functionB(){
    console.log('This is functionB');
  }
}

SampleClassUsingInterface.prototype.a = false;
SampleClassUsingInterface.prototype.b = true;

module.exports = SampleClassUsingInterface;