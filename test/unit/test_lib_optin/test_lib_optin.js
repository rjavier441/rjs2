//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					test_lib_optin.js
//	@Date Created:	2019-11-10
//	@Last Modified:	2019-11-10
//	@Details:
//									Unit test for _lib_optin.js
//	@Dependencies:
//									MochaJS v4.1.0+
//									ChaiJS v4.1.2+

'use strict';
const chai = require('chai');
const assert = chai.assert;
const _lib_optin = require('../../../util/_lib_optin.js');


// BEGIN _lib_optin
describe('Module _lib_optin', function () {

	// Force ignore SslManager due to problematic access rights to CA keys/certs
	_lib_optin._meta._ignore.push( 'SslManager' );
	
	// @test					_lib_optin._optin()
	// @description		Tests automated optin of libraries.
	describe( '_lib_optin._optin()', function() {

		it( 'should generate the desired library references', function( done ) {

			var requestedLibs = {
				lib1: [ 'settings', 'Logger' ],
				lib2: [ 'ColorLogger', 'Util' ]
			};
			var lib1 = _lib_optin._optin( requestedLibs.lib1 );
			var lib2 = _lib_optin._optin( requestedLibs.lib2 );

			assert.hasAllKeys( lib1, requestedLibs.lib1 );
			assert.hasAllKeys( lib2, requestedLibs.lib2 );
			done();
		} );

		it( 'should include all unignored libraries', function( done ) {

			var lib = _lib_optin._optin();
			var whitelist = Object.keys( _lib_optin );
			
			// Remove library keys to ignore
			_lib_optin._meta._ignore.forEach( function( libToIgnore ) {
				if( whitelist.includes( libToIgnore ) ) {
					whitelist.splice( whitelist.indexOf( libToIgnore ), 1 );
				}
			} );

			assert.hasAllKeys( lib, whitelist );
			done();
		} );

		it( 'should not contain ignored libraries', function( done ) {

			var libAll = _lib_optin._optin();
			var libSome = _lib_optin._optin( [
				'Logger',
				'ColorLogger',
				'settings'
			] );
			var libsToIgnore = _lib_optin._meta._ignore;
			assert.doesNotHaveAnyKeys( libAll, libsToIgnore );
			assert.doesNotHaveAnyKeys( libSome, libsToIgnore );
			done();
		} );

		it( 'should include classes from the _Lib.Class', function( done ) {

			var lib = _lib_optin._optin( ['Class'] );
			assert.hasAllKeys( lib, [ 'Class' ] );
			assert.hasAllKeys( lib.Class, Object.keys( _lib_optin.Class ) );
			done();
		} );
	} );
});
// END _lib_optin


// END test_lib_optin.js
