//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					testMongoDbConnection.js
//	@Date Created:	2019-11-05
//	@Last Modified:	2019-11-05
//	@Details:
//									Contains unit test code to test the MongoDbConnection class.
//	@Dependencies:
//									MochaJS v4.1.0+
//									ChaiJS v4.1.2+

'use strict';
const chai = require('chai');
const assert = chai.assert;
// const sinon = require('sinon');
const MongoClient = require('../common/stubs/stubMongoClient.js');
const Database = require('../../../util/dbi/class/database.js');
const MongoDbConnection = require(
	'../../../util/dbi/class/mongoDbConnection.js'
);
// // DEBUG
// assert.fail( __dirname );


// BEGIN MongoDbConnection
describe('Module MongoDbConnection', function () {

	// @test					MongoDbConnection.constructor
	// @description		Tests the constructor'setting properties.
	describe( 'MongoDbConnection.constructor()', function() {

		var input = {
			database: 'rjsdb',
			hostname: 'localhost',
			port: 27017,
			username: 'someUsername',
			password: 'somePassword'
		}
		var conn = new MongoDbConnection(
			{
				MongoClient: MongoClient,
				Database: Database
			},
			input.database,
			input.hostname,
			input.port,
			input.username,
			input.password
		);

		it( 'should store inputs properly', function( done ) {

			assert.strictEqual( conn.dbInfo.name, input.database );
			assert.include( conn.dbInfo.url, input.username );
			assert.include( conn.dbInfo.url, input.password );
			assert.include( conn.dbInfo.url, input.port );
			done();
		} );
	} );
});
// END MongoDbConnection


// END testMongoDbConnection.js
