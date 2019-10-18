//	PROJECT:				Core-v4
//	Name:						R. Javier
//	File:           api/app/routes/fitnessEngine/index.js
//	Date Created:		September 03, 2019
//	Last Modified:	September 03, 2019
//	Details:
//									This file contains routing logic to service all routes
//									requested under the the
//	            		"fitnessEngine" endpoint (a.k.a. the Fitness Engine Module)
//	Dependencies:
//									n/a

"use strict";

// Includes (include as many as you need; the bare essentials are included here)
var express = require("express");
var https = require("https");
var fs = require("fs");
var router = express.Router();
var settings = require("../../../../util/settings");    // import server system settings
var al = require(`${settings.util}/api_legend.js`);             // import API Documentation Module
var au = require(`${settings.util}/api_util.js`);               // import API Utility Functions
// var dt = require(`${settings.util}/datetimes`);              // import datetime utilities
var ef = require(`${settings.util}/error_formats`);             // import error formatter
var rf = require(`${settings.util}/response_formats`);              // import datetime utilities
var crypt = require(`${settings.util}/cryptic`);             // import custom sce crypto wrappers
// var ssl = require(settings.security);                                   // import https ssl credentials
var credentials = require(settings.credentials);             // import server system credentials
var www = require(`${settings.util}/www`);                   // import custom https request wrappers
var logger = require(`${settings.util}/logger`);                // import event log system

// Required Endpoint Options
var apitoken = "ee17d43cd946bac1c0e1926327ec2bdb61b3ec347b1f9af121710c303e79c9ad";	// access control
var options = {
	root: settings.root,    // Server root directory (i.e. where server.js is located)
	dotfiles: "deny",
	headers: {
		"x-timestamp": Date.now(),
		"x-sent": true
	}
};
var ssl_user_agent = new https.Agent({
	"port": settings.port,
	// "ca": fs.readFileSync(ssl.cert, 'utf8')
	// "ca": fs.readFileSync(ssl.ca, 'utf8'),
	// "cert": fs.readFileSync(ssl.cert, 'utf8'),
	// "key": fs.readFileSync(ssl.prvkey, 'utf8')
});

// Link api documentation path
// Documentation Template Styling
router.use( "/docTemplate.css", express.static(
	`${settings.util}/class/al/template/docTemplate.css`
) );

// Initialize API Documentation Arguments
var api = al.createLegend(
	"Fitness Engine",
	"This API enables the exchange of fitness data for personal gym routines",
	router    // reference to the router object
);
var apiInfo = {
	"args": {},
	"rval": {}
};





// BEGIN Fitness Engine Routes

// @endpoint			(GET) /help
// @description		This endpoint sends the client documentation on this API module (Ability)
// @parameters		(object) request		The web request objec provided by express.js. The
//																		request body is expected to be a JSON object with the
//																		following members:
//								~(boolean) pretty		A boolean to request a pretty HTML page of the API
//																		Module documentation
//								(object) response		The web response object provided by express.js
// @returns				On success: a code 200, and the documentation in the specified format
//								On failure: a code 500, and an error format object
apiInfo.args.help = [
	{	
		"name": "request.pretty",
		"type": "~boolean",
		"desc": "An optional boolean to request a pretty HTML page of the Ability API doc"
	}
];
apiInfo.rval.help = [
	{
		"condition": "On success",
		"desc": "a code 200, and the documentation in the specified format"
	},
	{
		"condition": "On failure",
		"desc": "a code 500, and an error format object"
	}
];
api.register(
	"Help",
	"GET",
	"/help",
	"This endpoint sends the client documentation on API module (FitnessEngine)",
	apiInfo.args.help,
	apiInfo.rval.help,
	function ( request, response ) {

		var handlerTag = { "src": "(get) /api/fitnessEngine/help"};
		var pretty = ( typeof request.query.pretty !== "undefined" ? true : false );

		try {

			// Determine how to represent the API doc
			if ( pretty ) {

				logger.log( `Sending pretty API doc to client @ ip ${request.ip}`, handlerTag );
				response.set( "Content-Type", "text/html" );
			} else {

				logger.log( `Sending API doc to client @ ip ${request.ip}`, handlerTag );
				response.set( "Content-Type", "application/json");
			}

			// Send the API doc
			var output = pretty ? al.getDoc( true ) : rf.asCommonStr(
				true, al.getDoc( false )
			);
			response.send( output ).status( 200 ).end();
		} catch ( exception ) {
			
			response.set( "Content-Type", "application/json" );
			response.status( 500 ).send(
				ef.asCommonStr( ef.struct.coreErr, { "exception": exception } )
			).end();
		}
	}
);

// @endpoint			(POST) /login
// @description		This endpoint enables a user to login to their Fitness Engine
//								account.
// @parameters    (object) request    The web request object provided by
//                                    express.js. The request body accepts the
//                                    following arguments:
//                  (string) username   The username to login with
//                  (string) password   The plaintext password to login with
//                (object) response   The web response object provided by
//                                    express.js.
// @returns       On success: a code 200 and a JSON object with keys "token" and
//														"refreshToken".
//                On invalid credentials: a code 200 and ef object
//                On failure: a code 500 and an error format object
apiInfo.args.login = [
	{
		"name": "request.username",
		"type": "string",
		"desc": "The username to login with"
	},
	{
		"name": "request.password",
		"type": "string",
		"desc": "The plaintext password to login with"
	}
];
apiInfo.rval.login = [
	{
		"condition": "On success",
		"desc": "a code 200 and a JSON object with keys \"token\" and \"refreshToken\""
	},
	{
		"condition": "On failure",
		"desc": "a code 500 and an error format object"
	}
];
api.register(
	"Login",
	"POST",
	"/login",
	"This endpoint enables a user to login to their fitness engine account.",
	apiInfo.args.login,
	apiInfo.rval.login,
	function( request, response ) {

    var handlerTag = { "src": "(post) /api/fitnessEngine/login" };
    response.set( "Content-Type", "application/json" );
    logger.log( `Login request from client @ ip ${request.ip}`, handlerTag );
    
    // IN PROGRESS
    try {

      // Gather arguments
      var username = ( request.body.username ?
        request.body.username : false
      );
      var password = ( request.body.password ?
        request.body.password : false
      );
  
      // Ensure response is complete
      if( username && password ) {
				// Define algorithm stages
				var submitCredentials = {};
				var storeToken = {};
				var storeRefreshToken = {};

        // Step 1: Search users with the given username and hashed password
        submitCredentials.requestBody = {
          accessToken: credentials.mdbi.accessToken,
          collection: "fitnessEngine",
          pipeline: [
            {
              $match: {
                username: {
                  $eq: username
                },
                password: {
                  $eq: crypt.hashPwd( username, password ),	// hashed/salted pwd
                }
              }
            }
          ]
        };
        submitCredentials.requestOptions = {
          hostname: settings.hostname,
          port: settings.port,
          path: "/mdbi/search/aggregation",
          method: "POST",
          agent: ssl_user_agent,
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(
              JSON.stringify( submitCredentials.requestBody )
            )
          }
        };
        submitCredentials.callback = function( reply, error ) {
          if( error ) {
            logger.log( `Failed: ${error}`, handlerTag );
            response.status( 500 ).send(
              ef.asCommonStr(ef.struct.coreErr, error)
            ).end();
          } else {
            logger.log(
              `${reply.length} ${reply.length === 1 ? "result" : "results"}`,
              handlerTag
            );
            if( reply === null ) {
              response.status( 500 ).send(
                ef.asCommonStr( ef.struct.unexpectedValue, `Received null` )
              ).end();
            } else if( reply.length === 0 ) {
              response.status( 200 ).send(
                ef.asCommonStr( ef.struct.coreErr, { msg: "Invalid credentials" } )
              ).end();
            } else {

							// Run algorithm at stage 2
							logger.log( `Credentials Verified. User "${username}" successfully` +
              ` authenticated. Generating session token and refresh token`, handlerTag );
							www.https.post(
								storeToken.requestOptions, storeToken.requestBody,
								storeToken.callback, handlerTag.src
							);
            }
          }
				};

				var expirationDate = new Date( Date.now() );
				expirationDate.setHours( expirationDate.getHours() + 2 );
				var sessionToken = crypt.hashSessionID( expirationDate.toLocaleString() );
				var refreshToken = crypt.hashSessionID( (new Date( Date.now() )).toLocaleString() );
				storeToken.requestBody = {
					accessToken: credentials.mdbi.accessToken,
					collection: 'fitnessEngineTokens',
					data: {
						token: sessionToken,
						expiration: expirationDate.toLocaleString()
					}
				};
				storeToken.requestOptions = {
					hostname: settings.hostname,
          port: settings.port,
          path: "/mdbi/write",
          method: "POST",
          agent: ssl_user_agent,
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(
              JSON.stringify( storeToken.requestBody )
            )
          }
				};
				storeToken.callback = function( reply, error ) {
					if( error ) {
            logger.log( `Failed: ${error}`, handlerTag );
            response.status( 500 ).send(
              ef.asCommonStr(ef.struct.coreErr, error)
						).end();
					} else {
						logger.log(
              `Reply: ${reply}`,
              handlerTag
            );
            if( reply === null ) {
              response.status( 500 ).send(
                ef.asCommonStr( ef.struct.unexpectedValue, `Received null` )
              ).end();
            } else {
							
							// Run algorithm at stage 3
							logger.log(
								`Session token saved. Generating refresh token`,
								handlerTag
							);
							www.https.post(
								storeRefreshToken.requestOptions, storeRefreshToken.requestBody,
								storeRefreshToken.callback, handlerTag.src
							);
            }
					}
				};

				storeRefreshToken.requestBody = {
					accessToken: credentials.mdbi.accessToken,
					collection: 'fitnessEngineTokens',
					data: {
						token: refreshToken,
						expiration: expirationDate.toLocaleString()
					}
				};
				storeRefreshToken.requestOptions = {
					hostname: settings.hostname,
          port: settings.port,
          path: "/mdbi/write",
          method: "POST",
          agent: ssl_user_agent,
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(
              JSON.stringify( storeRefreshToken.requestBody )
            )
          }
				};
				storeRefreshToken.callback = function( reply, error ) {
					if( error ) {
            logger.log( `Failed: ${error}`, handlerTag );
            response.status( 500 ).send(
              ef.asCommonStr(ef.struct.coreErr, error)
						).end();
					} else {
						logger.log(
              `Reply: ${reply}`,
              handlerTag
            );
            if( reply === null ) {
              response.status( 500 ).send(
                ef.asCommonStr( ef.struct.unexpectedValue, `Received null` )
              ).end();
            } else {

							// Send tokens to client
							var payload = {
								sessionToken: sessionToken,
								refreshToken: refreshToken
							}
							logger.log( `Refresh token saved`, handlerTag );
              response.status( 200 ).send(
                rf.asCommonStr( true, payload )
              ).end();
            }
					}
				};

        // Run algorithm at step 1
        www.https.post(
          submitCredentials.requestOptions, submitCredentials.requestBody,
          submitCredentials.callback, handlerTag.src
				);
      } else {
  
        // Send error
        logger.log( `Incomplete body`, handlerTag );
        response.status( 500 ).send(
          ef.asCommonStr( ef.struct.invalidBody )
        ).end();
      }
    } catch( exception ) {

      // Send error
      logger.log( `Exception:${exception}`, handlerTag );
      response.status( 500 ).send(
        ef.asCommonStr( ef.struct.coreErr, { "exception": exception, "msg": "catch fail" } )
      ).end();
    }
	}
);

// @endpoint      (GET) /ping
// @description   This endpoint is used to ping the Fitness Engine Module API
//                router.
// @parameters    (object) request    The web request object provided by
//                                    express.js. The request body doesn't
//                                    require any arguments.
//                (object) response   The web response object provided by
//                                    express.js.
// @returns       On success: a code 200 and a ping message
//                On failure: a code 500 and an error format object
apiInfo.args.ping = [];
apiInfo.rval.ping = [
	{
		"condition": "On success",
		"desc": "This function returns a code 200 and a ping message"
	},
	{
		"condition": "On failure",
		"desc": "This function returns a code 500 and an error format object"
	}
];
api.register(
	"Ping",
	"GET",                                  // http request type string
	"/ping",
	"This endpoint is used to ping the Fitness Engine Module API router.",
	apiInfo.args.ping,                   // the API's request arguments (i.e. body/querystring)
	apiInfo.rval.ping,                   // the API's response/return values
	function ( request, response ) {

		var handlerTag = { "src": "(get) /api/fitnessEngine/ping" };
		logger.log( `Sending ping to client @ ip ${request.ip}`, handlerTag );

		// Send PING Packet
		var pingPacket = {
			"data": "ping!"
		};

		response.set( "Content-Type", "application/json" );
		response.send(
			rf.asCommonStr( true, pingPacket )
		).status( 200 ).end();
	}
);

// @endpoint			test
// @description		A test endpoint
// @parameters		(object) request    The web request object provided by
//                                    express.js. The request expects the
//																		following querystring arguments:
//									(number) testId			A number identifying the test to run
//									(string) token			A token used to enable execution of a
//																			test.
//                (object) response   The web response object provided by
//                                    express.js.
// @returns				?
apiInfo.args.test = [];
apiInfo.rval.test = [];
api.register(
	"Test",
	"GET",
	"/test",
	"A test endpoint",
	apiInfo.args.test,
	apiInfo.rval.test,
	function( request, response ) {

		var handlerTag = { "src": "(get) /api/fitnessEngine/test" };
		var testBlacklist = [];	// tests to ignore
		
		try{

			// Gather arguments
			var testId = ( request.query.testId ?
				parseInt( request.query.testId ) : false
			);
			var token = ( request.query.token ?
				request.query.token : false
			);
			
			// Configure response options
			response.set( "Content-Type", "application/json" );

			// Ensure test Id is provided
			logger.log(
				`Request from client @ ip ${request.ip} to run test #${testId}`,
				handlerTag
			);
			if( token === apitoken && testId !== false && !testBlacklist.includes( testId ) ) {

				switch( testId ) {

					// Test 0: Acquire data from fitnessEngine Collection
					case 0: {

						logger.log( `Running test #0...`, handlerTag );
						var query = {
							body: {
								"accessToken": credentials.mdbi.accessToken,
								"collection": "fitnessEngine",
								"search": {
									"username": "user1"
								},
								"options": {
									"limit": 1000
								}
							},
							options: {
								"hostname": settings.hostname,	// "localhost",
								"path": "/mdbi/search/documents",
								"method": "POST",
								"agent": ssl_user_agent,
								"headers": {
									"Content-Type": "application/json"
								}
							},
							callback: function( reply, error ) {
								
								// TODO: figure out why this returns nothing...
								if( error ) {
									logger.log( `MDBI search failed: ${error}`, handlerTag );
									response.status( 500 ).send(
										ef.asCommonStr( ef.struct.coreErr, `Internal Server Error` )
									).end();
								} else {
									response.status( 200 ).send( reply ).end();
								}
							}
						};
						query.options.headers["Content-Length"] = Buffer.byteLength(
							JSON.stringify( query.body )
						);

						logger.log( `Sending request...`, handlerTag );
						www.https.post(query.options, query.body, query.callback, handlerTag.src);
						break;
					}

					// Test 1: Create new user account
					case 1: {

						// TODO: call createNewUser
						break;
					}

					default: {

						var emsg = ef.asCommonStr( ef.struct.coreErr, { "exception": "unknown test" } );
						logger.log( emsg, handlerTag );
						response.status( 500 ).send( emsg ).end();
						break;
					}
				}
			} else {
				response.status( 500 ).send(
					ef.asCommonStr( ef.struct.coreErr, { "exception": "invalid input" } )
				).end();
			}
		} catch( exception ) {
			response.status( 500 ).send(
				ef.asCommonStr( ef.struct.coreErr, { "exception": exception, "msg": "catch fail" } )
			).end();
		}
	}
);

// @endpoint			(GET) /user
// @description		Gets a list of all users, or the user with the specified
//								username if provided.
// @parameters		(object) request    The web request object provided by
//                                    express.js. The request body accepts the
//                                    following arguments:
//									(string) token			The session token used to validate the
//																			request
//									(~string) username	The username of the user to search for.
//																			If omitted, a list of all users will be
//																			returned
//									(~number) limit			The maximum amount of records to return.
//																			If omitted, all records will be returned
//																			(use of limit is strongly recommended).
//                (object) response   The web response object provided by
//                                    express.js.
// @returns				?
apiInfo.args.userGet = [];
apiInfo.rval.userGet = [];
api.register(
	"User Get",
	"GET",
	"/user",
	"Gets a list of all users, or the user with the specified username",
	apiInfo.args.userGet,
	apiInfo.rval.userGet,
	function( request, response ) {

		var handlerTag = { "src": "(post) /api/fitnessEngine/user/create" };
		response.set( "Content-Type", "application/json" );

		try {

      // Gather arguments
      var token = ( request.query.token ?
				request.query.token : false
      );
      var username = ( request.query.username ?
        request.query.username : false
      );
      var limit = ( request.query.username ?
        request.query.username : false
      );

			// Configure response options
			response.set( "Content-Type", "application/json" );

			// TODO: Ensure request is complete

			// TODO: Define algorithm stage parameters

			// TODO: Search for users given any search criteria

			// TODO: Return response to client

			// DEBUG
			response.status( 200 ).send( rf.asCommonStr( true, {
				requestObjectKeys: Object.keys( request )
			} ) ).end();
		} catch( exception ) {
			response.status( 500 ).send(
				ef.asCommonStr( ef.struct.coreErr, { "exception": exception } )
			).end();
		}
	}
);


// @endpoint			(POST) /user/create
// @description		This endpoint enables the creation of a new user provided that
//								the user has a valid invite code
// @parameters		(object) request    The web request object provided by
//                                    express.js. The request body accepts the
//                                    following arguments:
//									(string) itoken			The invite token that enables the new
//																			user to be created
//									(string) username		The desired username
//									(string) password		The desired password in plaintext. Don't
//																			worry; HTTPS encryptes the payload.
//									(string) name				The full name of the user
//									(number) age				The user's age
//									(string) gender			The user's gender
//									(number) height			The user's height, in inches
//									(number) weight			The user's weight, in lbs
//                (object) response   The web response object provided by
//                                    express.js.
// @returns				On success:					A code 200, and true
//								On invalid input		A code 400
//								On existing user		A code 409, and an error-format object
//								On failure:					A code 500, and an error-format object
apiInfo.args.userCreate = [
	{
		name: "request.itoken",
		type: "string",
		desc: "The invite token that enables the new user to be created"
	},
	{
		name: "request.username",
		type: "string",
		desc: "The desired username"
	},
	{
		name: "request.password",
		type: "string",
		desc: "The desired password in plaintext"
	},
	{
		name: "request.name",
		type: "string",
		desc: "The full name of the user"
	},
	{
		name: "request.age",
		type: "number",
		desc: "The user's age"
	},
	{
		name: "request.gender",
		type: "string",
		desc: "The user's gender"
	},
	{
		name: "request.height",
		type: "number",
		desc: "The user's height, in inches"
	},
	{
		name: "request.weight",
		type: "number",
		desc: "The user's weight, in lbs"
	}
];
apiInfo.rval.userCreate = [
	{
		condition: "On success",
		desc: "A code 200, and true"
	},
	{
		condition: "On invalid input",
		desc: "A code 400, and true"
	},
	{
		condition: "On existing user",
		desc: "A code 409, and an error-format object"
	},
	{
		condition: "On failure",
		desc: "A code 500, and an error-format object"
	},
];
api.register(
	"User Create",
	"POST",
	"/user/create",
	"Creates a new user in the fitness engine database",
	apiInfo.args.userCreate,
	apiInfo.rval.userCreate,
	function( request, response ) {

		var handlerTag = { "src": "(post) /api/fitnessEngine/user/create" };
		response.set( "Content-Type", "application/json" );

		try {

			// Gather arguments
			logger.log( `Gathering arguments...`, handlerTag );
			var itoken = ( typeof request.body.itoken === "string" ?
				request.body.itoken : false
			);
			var username = ( typeof request.body.username === "string" ?
				request.body.username : false
			);
			var password = ( typeof request.body.password === "string" ?
				request.body.password : false
			);
			var name = ( typeof request.body.name === "string" ?
				request.body.name : false
			);
			var age = ( typeof request.body.age === "number" ?
				request.body.age : false
			);
			var gender = ( typeof request.body.gender === "string" ?
				request.body.gender : false
			);
			var height = ( typeof request.body.height === "number" ?
				request.body.height : false
			);
			var weight = ( typeof request.body.weight === "number" ?
				request.body.weight : false
			);

			// Ensure request is complete
			if(
				itoken === apitoken && username && password && name && age && gender && height && weight
			) {

				// Define algorithm stage parameters
				var checkUniqueness = {};
				var createUser = {};
				var verifyInsertion = {};

				// Compile user data
				var user = {
					username: username,
					password: crypt.hashPwd( username, password ),	// hashed/salted pwd
					name: name,
					age: age,
					gender: gender,
					height: height,
					weight: weight,
					fitnessData: {}
				};

				// Step 1: Check user uniqueness
				checkUniqueness.requestBody = {
					accessToken: credentials.mdbi.accessToken,
					collection: "fitnessEngine",
					pipeline: [
						{
							$match: {
								username: {
									$eq: username
								}
							}
						},
						{
							$count: "matches"
						}
					]
				};
				checkUniqueness.requestOptions = {
					hostname: settings.hostname,
					port: settings.port,
					path: "/mdbi/search/aggregation",
					method: "POST",
					agent: ssl_user_agent,
					headers: {
						"Content-Type": "application/json",
						"Content-Length": Buffer.byteLength(
							JSON.stringify( checkUniqueness.requestBody )
						)
					}
				};
				checkUniqueness.callback = function( reply, error ) {
					if( error ) {
						logger.log( `Failed: ${error}`, handlerTag );
						response.status( 500 ).send(
							ef.asCommonStr(ef.struct.coreErr, error)
						).end();
					} else {
						logger.log(
							`${reply.length} ${reply.length === 1 ? "result" : "results"}`,
							handlerTag
						);
						if( reply === null ) {
							response.status( 500 ).send(
								ef.asCommonStr( ef.struct.unexpectedValue, `Received null` )
							).end();
						} else if( reply.length > 0 || reply.matches >= 1 ) {
							response.status( 409 ).send(
								ef.asCommonStr( ef.struct.coreErr, { msg: "Username already exists" } )
							).end();
						} else {
							
							// Run algorithm at second step
							logger.log( `Creating user`, handlerTag );
							www.https.post(
								createUser.requestOptions, createUser.requestBody,
								createUser.callback, handlerTag.src
							);
						}
					}
				};

				// Step 2: Create new user in database
				createUser.requestBody = {
					accessToken: credentials.mdbi.accessToken,
					collection: "fitnessEngine",
					data: user
				};
				createUser.requestOptions = {
					hostname: settings.hostname,
					port: settings.port,
					path: "/mdbi/write",
					method: "POST",
					agent: ssl_user_agent,
					headers: {
						"Content-Type": "application/json",
						"Content-Length": Buffer.byteLength(
							JSON.stringify( createUser.requestBody )
						)
					}
				};
				createUser.callback = function( reply, error ) {
					if( error ) {
						var emsg = ef.asCommonStr( ef.struct.httpsPostFail, error );
						logger.log( `User creation failed: ${emsg}`, handlerTag );
						response.status( 500 ).send( emsg ).end();
					} else {

						// Run algorithm at step 3
						logger.log( `Verifying user was added`, handlerTag );
						www.https.post(
							verifyInsertion.requestOptions, verifyInsertion.requestBody,
							verifyInsertion.callback, handlerTag.src
						);
					}
				};

				// Step 3: Verify user was inserted into database
				verifyInsertion.requestBody = {
					accessToken: credentials.mdbi.accessToken,
					collection: "fitnessEngine",
					search: {
						username: username
					}
				};
				verifyInsertion.requestOptions = {
					hostname: settings.hostname,
					port: settings.port,
					path: "/mdbi/search/documents",
					method: "POST",
					agent: ssl_user_agent,
					headers: {
						"Content-Type": "application/json",
						"Content-Length": Buffer.byteLength(
							JSON.stringify( verifyInsertion.requestBody )
						)
					}
				};
				verifyInsertion.callback = function( reply, error ) {
					if( error ) {
						var emsg = ef.asCommonStr( ef.struct.httpsPostFail, error );
						logger.log( `Verification failed: ${emsg}`, handlerTag );
						response.status( 500 ).send( emsg ).end();
					} else {
						response.status( 200 ).send( rf.asCommonStr( true, true ) ).end();
					}
				};

				// Run algorithm at first step
				logger.log( `Checking for username uniqueness`, handlerTag );
				www.https.post(
					checkUniqueness.requestOptions, checkUniqueness.requestBody,
					checkUniqueness.callback, handlerTag.src
				);
			} else {
				logger.log( `Request was incomplete/malformed/missing data`, handlerTag );
				response.status( 400 ).send(
					ef.asCommonStr( ef.struct.coreErr )
				).end();
			}
		} catch( exception ) {

			logger.log( `Exception was thrown`, handlerTag );
			response.status( 500 ).send(
				ef.asCommonStr( ef.struct.coreErr, { "exception": exception } )
			).end();
		}
	}
);

// END Fitness Engine Routes





module.exports = router;
// END fitnessEngine/index.js
