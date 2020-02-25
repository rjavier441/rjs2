//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			cryptic.js
// 	Date Created: 	2018-01-29
// 	Last Modified: 	2020-03-02
// 	Details:
// 					This file contains custom cryptography functions used throughout the
//	        rjs2 system to encrypt various credentials, settings, etc.
// 	Dependencies:
// 					node_hash v0.2.0

"use strict";

// Includes
const fs = require( 'fs' );
const hash = require("node_hash");

// Global
const saltPath = `${__dirname}/common/security/cryptic.json`;

// Container (Singleton)
const cryptic = {};



// BEGIN Member Functions
/*
	@function 	hashPwd
	@parameter 	username - the user's username
	@parameter 	password - the un-hashed, plain-text password
	@returns 	the hashed password
	@details 	This function is meant for use in adding users' passwords to the database, and verifying a password match when credentials are given to the server for login. It uses a rendition of the username as a salt to generate the hashed password from the plain-text password.
*/
cryptic.hashPwd = function (username, password) {

  // Load the currently set salt
  let salt = ( ( username.length + 3 ) % 12 ).toString() +
    JSON.parse( fs.readFileSync(
      saltPath,
      { encoding: 'utf8' }
    ) ).salt;

	return hash.sha256(password, salt);
};

/*
	@function 	hashSessionID
	@parameter 	username - the user's username
	@returns 	the unique session ID token to use on all requests
	@details 	This function is meant for use in generating sessionIDs after a successful login credential validation occurs. It generates the token by using the username hashed with the current date ISO string as a salt.
*/
cryptic.hashSessionID = function (username) {
  // Load the currently set salt
  let salt = ( ( username.length + 3 ) % 12 ).toString() +
    JSON.parse( fs.readFileSync(
      saltPath,
      { encoding: 'utf8' }
    ) ).salt;
	let dateSalt = salt + (new Date(Date.now())).toISOString();

	return hash.sha256(username, dateSalt);
};
// END Member Functions



Object.freeze(cryptic);



module.exports = cryptic;

// END cryptic.js
