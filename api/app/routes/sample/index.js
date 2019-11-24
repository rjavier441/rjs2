//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					api/app/routes/sample/index.js
//	@Date Created:	2019-10-21
//	@Last Modified:	2019-11-01
//	@Details:
//									This file contains routing logic to service all routes
//									requested under the 'Sample' endpoint (a.k.a. the
//									Sample Module).
//	@Dependencies:
//									n/a

'use strict';

// BEGIN includes
const _lib = require( '../../../../util/_lib.js' );
const express = require( 'express' );
const mongodb = require( 'mongodb' );
const router = express.Router();
// END includes

// Example API Documentation Arguments
var api = _lib.ApiLegend.createLegend(
	'Sample',
	'A Sample API',
	router					// reference to the router object
);
var apiInfo = {
	'args': {},
	'rval': {}
};



// BEGIN Sample Routes

// Example single-point API route
// @endpoint			(GET) /ping
// @description		This endpoint allows the client to ping this API
// @parameters		(object) request			The web request object provided by
//																			express.js. The request body has no
//																			members.
//								(object) response			The web response object provided by
//																			express.js.
// @returns				n/a
apiInfo.args.sample = [
	{
		name: 'API argument #1',
		type: '~string',		// '~' = optional
		desc: 'An optional string argument for this API'
	}
];
apiInfo.rval.sample = [
	{
		condition: 'On success',
		desc: 'Returns a code 200 and a ping message.'
	},
	{
		condition: 'On failure',
		desc: 'Returns false'
	}
];
api.register(
	'Sample Endpoint',
	'GET',									// http request type string
	'/ping',
	'Pings the Sample API',
	apiInfo.args.sample,		// the API's request arguments (i.e. body/querystring)
	apiInfo.rval.sample,		// the API's response/return values
	function ( request, response ) {

		var args = request.method === 'GET' ? request.params : request.body;
		var ht = new _lib.Class.HandlerTag( this, 'api' );

		response.set( "Content-Type", "application/json" );
		response.send(
			new _lib.Class.ServerResponse( 'Ping!' )
		).status( 200 ).end();
		_lib.Logger.log(
			`Sending 'Ping!' to client @ ip ${request.ip}`,
			ht.getTag()
		);
	}
);

// Example API URI route
// @endpoint			(GET) data/[id]
// @description		This endpoint allows the acquisition of the data specified by
//								'id', enabling REST-fulness since each data id acts as its own
//								resource.
// @parameters		(object) request			The web request object provided by
//																			express.js. The request body can have
//																			the following members:
//									(string) id						The ID with which to request data.
//								(object) response			The web response object provided by
//																			express.js.
// @returns				n/a
apiInfo.args.data = [
	{
		name: 'id',
		type: 'string',
		desc: 'An ID to return back to the user'
	}
];
apiInfo.rval.data = [
	{
		condition: 'On success',
		desc: 'Returns a code 200 and the same id that was passed'
	},
	{
		condition: 'On failure',
		desc: 'Returns a code 500'
	}
];
api.register(
	'Sample URI Endpoint',
	'GET',
	'/data/:id',
	'Acquires data from various resources with "id".',
	apiInfo.args.data,
	apiInfo.rval.data,
	function( request, response ) {

		var args = request.method === 'GET' ? request.params : request.body;
		var ht = new _lib.Class.HandlerTag( this, 'api' );

		response.set( 'Content-Type', 'application/json' );
		response.send(
			new _lib.Class.ServerResponse( `Got '${args.id}' back!` )
		).status( 200 ).end();
		_lib.Logger.log(
			`Sending data for id '${args.id}' to client @ ip ${request.ip}`,
			ht.getTag()
		);
	}
);

// Example API Route with DB Query
// @endpoint			(GET) seeTestDb
// @description		Gets the collections in the database.
// @parameters		(object) request			The web request object provided by
//																			express.js. The request has no memebers.
//								(object) response			The web response object provided by
//																			express.js.
// @returns				n/a
apiInfo.args.seeTestDb = [];
apiInfo.rval.seeTestDb = [
	{
		condition: 'On success',
		desc: 'Returns a code 200 and records found in the test collection'
	},
	{
		condition: 'On failure',
		desc: 'Returns a code 500'
	}
];
api.register(
	'Sample Endpoint with DB Query',
	'GET',
	'/seeTestDb',
	'Gets the collections in the database',
	apiInfo.args.collections,
	apiInfo.rval.collections,
	function( request, response ) {

		var ht = new _lib.Class.HandlerTag( this, 'api' );

		// Connection String URI Format (from MongoDB official website)
		// mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[database][?options]]
		const url = 'mongodb://scedb:%40sce123@localhost:27017/rjsdb';
		const client = new mongodb.MongoClient( url, {
			useUnifiedTopology: true
		} );

		client.connect( ( error, conn ) => {

			response.set( 'Content-Type', 'application/json' );
			if( error ) {
				response.send(
					new _lib.Class.ServerError( 'Db conn error', error )
				).status(500).end();
				_lib.Logger.log( `Db conn error: ${error}`, ht.getTag() );
			} else {
				
				var db = conn.db();
				db.collection( 'temp' ).find().limit(1000).toArray( (err, docs) => {

					if( err ) {

						response.send(
							new _lib.Class.ServerError( 'Db query error', err )
						).status(500).end();
						_lib.Logger.log( `Db query error: ${err}`, ht.getTag() );
					} else {

						response.send(
							new _lib.Class.ServerResponse( JSON.stringify(docs) )
						).status(200).end();
						_lib.Logger.log(
							`Sending test db doc to client @ ip ${request.ip}`,
							ht.getTag()
						);
					}
				} );
			}
		} );
	}
);


// END Sample Routes

module.exports = router;

// END api/app/routes/sample/index.js
