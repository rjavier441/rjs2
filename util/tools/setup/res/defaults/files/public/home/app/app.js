//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					home/app/app.js
//	@Date Created:	2019-10-27
//	@Last Modified:	2019-10-27
//	@Details:
//									This file contains the rjs2 home sub-app exposed to the
//									public. It is used by the main app in server.js
//	@Dependencies:
//									ExpressJS 4.x
//									body-parser	(NPM middleware req'd by ExpressJS 4.x to
//															acquire POST data parameters: "npm install
//															--save body-parser")

'use strict';

// BEGIN includes
const _lib = require( '../../../util/_lib.js' );
const express = require( 'express' );
const bp = require( 'body-parser' );			// import POST request data parser
const routes = require( './routes' );			// import routes
// END includes


// BEGIN globals
const ht = { src: 'homeRouter' };
// END globals


// Page App
_lib.Logger.log(`Initializing SCE Home...`, ht );
const app = express();
app.use(bp.json({			// support JSON-encoded request bodies
	strict: true
}));
app.use(bp.urlencoded({		// support URL-encoded request bodies
	extended: true
}));



// Test Page Route
app.use("/", routes);	// serves the MongoDB Test Interface page



module.exports = app;
// END core/app/app.js
