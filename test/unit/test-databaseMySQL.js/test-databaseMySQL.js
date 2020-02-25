//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					test-databaseMySQL.js
//	@Date Created:	2020-02-20
//	@Last Modified:	2020-02-20
//	@Details:
//									Unit test for databaseMySQL.js
//	@Dependencies:
//									MochaJS v4.1.0+
//									ChaiJS v4.1.2+

'use strict';
const chai = require('chai');
const assert = chai.assert;
// const mysql = require( 'mysql' );	// replace with a mock of the mysql class
const MockMysql = require( '../common/mocks/mockMysql.js' );
const Connection = MockMysql.Connection;
const mysql = MockMysql.mysql;
const OkPacket = MockMysql.OkPacket;
const dblib = require( '../../../util/class/databaseMySQL.js' )( mysql );
const DatabaseMysql = dblib.DatabaseMysql;
const MysqlTableField = dblib.MysqlTableField;
const MysqlResult = dblib.MysqlResult;

// Globals
let db = {
	hostname: '127.0.0.1',
	username: 'username',
	password: 'password',
	db: 'rjs2'
}


// BEGIN class DatabaseMysql
describe('Module class DatabaseMysql', function () {
	
	// @test					create()
	// @description		Tests database table creation for the given database
	describe( 'create()', function() {

		it( 'should receive an OK when a table was created', function( done ) {

			let sut = new DatabaseMysql(
				db.hostname,
				db.username,
				db.password,
				db.db
			);

			let tblName = 'test_messages', fields = [
				new MysqlTableField(
					'id', 'int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT'
				),
				new MysqlTableField( 'userId', 'varchar(100) NOT NULL' ),
				new MysqlTableField( 'message', 'varchar(500)' )
			];

			// Test the function
			sut.create( tblName, fields ).then( ( result ) => {

				// // DEBUG
				// console.log( 'Result:', result );
				
				assert.instanceOf(
					result,
					MysqlResult,
					'Not an instance of MysqlResult'
				);
				assert.instanceOf(
					result.data,
					OkPacket,
					'OkPacket not received'
				);
			} ).catch( ( error ) => {

				// DEBUG
				console.log( 'Error:', error );
				
				assert.fail( error, undefined, 'An error occurred' );
			} ).then( () => {
				done();
			} );
		} );
	} );
	
	// @test					getConnection()
	// @description		Tests whether a connection can be established
	describe( 'getConnection()', function() {

		it( 'should give a Connection object', function( done ) {

			let sut = new DatabaseMysql(
				db.hostname,
				db.username,
				db.password,
				db.db
			);

			assert.instanceOf( sut.getConnection(), Connection, 'not a Connection!' );
			done();
		} );
	} );

	// @test					escape()
	// @description		Tests the escaping of strings.
	describe( 'escape()', function() {

		it( 'should escape strings properly', function( done ) {

			let expected = [
				'2',
				'3.2248',
				'\'SELECT * FROM asdf\'',
				'\'``\'',
				'\';-- DELETE FROM mysql.user WHERE id IS NOT NULL;\'',
				'`asdf` = \'asdf\''
			];
			let test = [
				2,
				3.2248,
				'SELECT * FROM asdf',
				'``',
				';-- DELETE FROM mysql.user WHERE id IS NOT NULL;',
				{ asdf: 'asdf' }
			];
			let sut = new DatabaseMysql(
				db.hostname,
				db.username,
				db.password,
				db.db
			);
			let conn = sut.getConnection();

			test.forEach( ( item, index ) => {
				assert.strictEqual( conn.escape( item ), expected[index] );
			} );
			done();
		} );
	} );
});
// END class DatabaseMysql


// END test-databaseMySQL.js
