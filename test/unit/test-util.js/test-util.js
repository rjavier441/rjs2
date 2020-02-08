//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					test-util.js
//	@Date Created:	2020-02-07
//	@Last Modified:	2020-02-07
//	@Details:
//									Unit test for util.js
//	@Dependencies:
//									MochaJS v4.1.0+
//									ChaiJS v4.1.2+

'use strict';
const chai = require('chai');
const assert = chai.assert;
const Util = require( '../../../util/util.js' );


// BEGIN Util
describe('Module Util', function () {
	
	// @test					Util.getCompatiblePath()
	// @description		Tests compatible path generation
	describe( 'Util.getCompatiblePath()', function() {

		// TODO:
		it( 'should convert Windows paths to Linux/MacOS paths', function( done ) {
			
			let windowsPaths = [
				'C:\\Users\\a\\Documents\\document.txt',
				'C:\\',
				'D:\\',
				''
			];
			let expected = [
				'C:/Users/a/Documents/document.txt',
				'C:/',
				'D:/',
				''
			];

			windowsPaths.forEach( ( path, index ) => {
				assert.strictEqual( Util.getCompatiblePath( path ), expected[index] );
			} );

			done();
		} );
	} );
});
// END Util


// END test-util.js
