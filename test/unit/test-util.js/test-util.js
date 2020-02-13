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
describe('[Module Util]', function () {
	
	// @test					Util.getCompatiblePath()
	// @description		Tests compatible path generation
	describe( 'Util.getCompatiblePath()', function() {

		it( 'should convert Windows paths to Linux/MacOS paths', function( done ) {
			
			let windowsPaths = [
				'C:\\Users\\a\\Documents\\document.txt',
				'C:\\Program Files(x86)',
				'D:\\',
				''
			];
			let expected = [
				'C:/Users/a/Documents/document.txt',
				'C:/Program Files(x86)',
				'D:/',
				''
			];

			windowsPaths.forEach( ( path, index ) => {
				assert.strictEqual( Util.getCompatiblePath( path, 'linux' ), expected[index] );
			} );

			done();
		} );

		it( 'should convert Linux/MacOS paths to Windows paths', function( done ) {

			let linuxPaths = [
				'/some/unix/path',
				'/some/unix/file.txt',
				'/',
				''
			];
			let expected = [
				'\\some\\unix\\path',
				'\\some\\unix\\file.txt',
				'\\',
				''
			];

			linuxPaths.forEach( ( path, index ) => {
				assert.strictEqual( Util.getCompatiblePath( path, 'Windows' ), expected[index] );
			} );

			done();
		} );

	} );

	// @test					Util.getPlatform()
	// @description		Tests OS Platform detection
	describe( 'Util.getPlatform()', function() {

		it( 'should return the current process\'s platform', function( done ) {

			let test = [
				'aix',
				'darwin',
				'freebsd',
				'linux',
				'openbsd',
				'sunos',
				'win32'
			];
			let expected = [
				'unsupported',
				'MacOS',
				'unsupported',
				'Linux',
				'unsupported',
				'unsupported',
				'Windows'
			];

			test.forEach( ( osname, index ) => {
				assert.strictEqual( Util.getPlatform( {
					platform: osname
				} ), expected[index] );
			} );

			done();
		} );
	} );
	
	// @test					Util.isset()
	// @description		Tests object key detection
	describe( 'Util.isset()', function() {

		it( 'should check if an object member is set', function( done ) {
	
			let expectedResult = {
				a: true,
				b: true,
				c: false,
				2: false,
				1: true,
				asdff: false,
				asdf: true,
				".asdf": true
			};
			let testObject = {
				a: 0,
				b: 0,
				1: 0,
				asdf: 0,
				".asdf": 0
			};
			
			Object.keys( expectedResult ).forEach( ( key ) => {
	
				assert.strictEqual( Util.isset( testObject[key] ), expectedResult[key] );
			} );
	
			done();
		} );
	} );

	// @test					Util.trimLeadingSlash()
	// @description		Tests removal of a leading forward slash
	describe( 'Util.trimLeadingSlash()', function() {

		it( 'should remove a leading slash in a string', function( done ) {
			
			let test = [
				'',
				'/',
				'//',
				'/some/path/to/a/file.txt',
				'a/',
				'asdfasdfa'
			], expected = [
				'',
				'',
				'/',
				'some/path/to/a/file.txt',
				'a/',
				'asdfasdfa'
			];

			test.forEach( ( str, index ) => {

				assert.strictEqual( Util.trimLeadingSlash( str ), expected[index] );
			} );

			done();
		} );
	} );

	// @test					Util.trimSlashes()
	// @description		Tests removal of trailing and leading forward slashes
	describe( 'Util.trimSlashes()', function() {

		it( 'should remove only the first & last slash in a string', ( done ) => {
			
			let test = [
				'',
				'/',
				'//',
				'/some/path/to/a/file.txt',
				'///',
				'asdf/',
				'/hello/world/',
				'hi'
			], expected = [
				'',
				'',
				'',
				'some/path/to/a/file.txt',
				'/',
				'asdf',
				'hello/world',
				'hi'
			];

			test.forEach( ( str, index ) => {

				assert.strictEqual( Util.trimSlashes( str ), expected[index] );
			} );

			done();
		} );
	} );

	// @test					Util.trimTrailingSlash()
	// @description		Tests removal of only the last trailing slash.
	describe( 'Util.trimTrailingSlash()', function() {

		it( 'should remove a trailing slash', ( done ) => {

			let test = [
				'',
				'/',
				'//',
				'///',
				'/some/path/to/a/file.txt',
				'/hello/world/',
				'hi'
			], expected = [
				'',
				'',
				'/',
				'//',
				'/some/path/to/a/file.txt',
				'/hello/world',
				'hi'
			]

			test.forEach( ( str, index ) => {

				assert.strictEqual( Util.trimTrailingSlash( str ), expected[index] );
			} );

			done();
		} );
	} );
});
// END Util


// END test-util.js
