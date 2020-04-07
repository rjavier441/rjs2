//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					accessControl.js
//	@Date Created:	2020-03-17
//	@Last Modified:	2020-03-17
//	@Details:
//									Defines utility functions to support Access Control.
//	@Dependencies:
//									JavaScript ECMAScript 6
//	                NPM mysql library
//	                NPM jsonwebtoken library

'use strict';

// Includes
const HandlerTag = require( './class/handlerTag.js' );
const jwt = require( 'jsonwebtoken' );
const Logger = require( './logger.js' );
const SslManager = require( './sslManager.js' );

// Globals
const verifyKey = Buffer.from( SslManager.publicKey.toString(), 'utf8' );

// BEGIN class AccessControl
class AccessControl {

  // @ctor
  // @parameters		n/a
  constructor() {}

  // @function			verifyToken()
  // @description		Verifies the integrity of the given JWT token.
  // @parameters		(Connection) conn     A reference to a MySQL connection.
  //	              (string) token        The raw token string to verify.
  //	              (string) type         The token type. Valid values include:
  //	                                      'access'
  //	                                      'refresh'
  // @returns			  (Promise) promise     A promise that is executed. On success,
  //	                                    it resolves with `true`. On failure,
  //	                                    resolves with `false`. Otherwise,
  //	                                    rejects with `false`.
  static verifyToken( conn, token, type ) {

    return new Promise( ( resolve, reject ) => {

      let ht = new HandlerTag(
        'verifyToken',
        'string'
      ).getTag();
      try {

        // // DEBUG
        // console.log( 'token:', token );
        // console.log( 'public key:', SslManager.publicKey );
        // console.log( 'decoded:', jwt.decode( token ) );

        // Verify the token (or throw error on failed verification)
        let verified = jwt.verify(
          token,
          verifyKey,
          { algorithms: ['RS256'], maxAge: "1h" }
        );

        // // DEBUG
        // console.log( 'verified:', verified ? 'T' : 'F' );

        // Determine db to cross-reference
        let srcDb;
        switch( type ) {
          case 'access': {
            srcDb = 'access_tokens';
            break;
          }
          case 'refresh': {
            srcDb = 'refresh_tokens';
            break;
          }
          default:
            Logger.log( `Invalid token type "${type}"`, ht );
            reject( false );
        }

        // Submit search query
        let q = `SELECT * FROM rjs2.${srcDb} WHERE token = ${conn.escape(token)}`;
        conn.query( q, ( error, results, fields ) => {

          if( error ) {
            Logger.log( `Query error: ${error.toString()}`, ht );
            reject( false );
          } else if( results.length !== 1 ) {
            Logger.log( `No match found`, ht );
            resolve( false );
          } else {
            Logger.log( `Token verified`, ht );
            resolve( true );
          }
        } );
      } catch( exception ) {
        Logger.log( `Token verification failed: ${exception.toString()}`,ht);
        reject( false );
      }
    } );
  }
}
// END class AccessControl

module.exports = AccessControl;

// END accessControl.js
