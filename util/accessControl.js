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
const Util = require('./util.js');

// Globals
const verifyKey = Buffer.from( SslManager.publicKey.toString(), 'utf8' );
const signKey = Buffer.from( SslManager.privateKey.toString(), 'utf8' );

// BEGIN class AccessControl
class AccessControl {

  // @ctor
  // @parameters		n/a
  constructor() {}

  // @function			cookieHasToken()
  // @description		Checks to make sure the specified token cookie was
  //                found.
  // @parameters		(object) request      The web request object provided by
  //                                      express.js.
  //                (string) type         The type of token to search for in
  //                                      the cookies. Valid types* include:
  //                                        "access"
  //                                        "refresh"
  // @returns				(bool) success        Returns true if the specified
  //                                      token is found within the request
  //                                      cookies. Returns false otherwise.
  //                                      This parameter is typically used
  //                                      to signal early returns to prevent
  //                                      state-changing actions on invalid
  //                                      or missing tokens.
  // @notes         *This value is case-sensitive
  static cookieHasToken( request, type ) {
    if(
      Util.isset( request.cookies ) &&
      Util.isset( request.cookies[`${type}Token`] )
    ) {
      return true;
    }
    return false;
  }

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
            srcDb = 'app.user.access_tokens';
            break;
          }
          case 'refresh': {
            srcDb = 'app.user.refresh_tokens';
            break;
          }
          default:
            Logger.log( `Invalid token type "${type}"`, ht );
            reject( false );
        }

        // Submit search query
        let q = `SELECT * FROM \`rjs2\`.\`${srcDb}\` WHERE token = ${conn.escape(token)}`;
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

  // @function			registerToken()
  // @description		Records a newly created JWT of the given type to the
  //                appropriate internal database.
  // @parameters		(Connection) conn     A reference to a MySQL connection.
  //                (string) type         The token type. Valid types are:
  //                                        "access"
  //                                        "refresh"
  //                (string) token        The token to register.
  //                (number) exp          The number of seconds since epoch
  //                                      indicating when the given refresh
  //                                      token jwt expires.
  // @returns				(Promise) promise     An executable promise. On success,
  //                                      it resolves with the given token.
  //                                      On failure, resolves with false.
  //                                      Otherwise, rejects with an Error()
  //                                      instance.
  static registerToken( conn, type, token, exp ) {

    return new Promise( ( resolve, reject ) => {

      let ht = new HandlerTag(
        'registerToken', 'string'
      ).getTag();
      
      try {
        // Determine token type and config db settings
        let tokenType = ['access','refresh'].includes(type) ? type : false;
        let dbNames = {access: 'app.user.access_tokens', refresh: 'app.user.refresh_tokens'};
        if( !tokenType ) {
          throw new Error(`Invalid token type '${type}'`);
        }

        // Create and execute query to record the token
        let q = `INSERT INTO \`rjs2\`.\`${dbNames[type]}\` (token,` +
          `expirationSeconds) VALUES (${[
            conn.escape(token), conn.escape(exp)
          ].join()})`;
        conn.query( q, (error, results, fields ) => {
          if( error ) {
            throw error;
          } else if( results && results.affectedRows < 1 ) {
            Logger.log('No rows affected',ht);
            resolve( false );
          } else {
            Logger.log( `Registered ${type} token`, ht );
            resolve( {
              token: token
            } );
          }
        } );
      } catch( exception ) {
        Logger.log(
          `Token registration failed (${type}): ${exception.toString()}`,
          ht
        );
        reject( exception );
      }
    } );
  }

  // @function			generateAuthToken()
  // @description		Generates an authentication token object of the given
  //                type.
  // @parameters		(string) username     The name of the user requesting a
  //                                      new token*.
  //                (number) id           The id of the user requesting a
  //                                      new token*.
  //                (string) type         The type of token to generate and
  //                                      register. Valid types include:
  //                                        "access"
  //                                        "refresh"
  // @returns				(object) tokenObj     On success, returns the generated
  //                                      token object with the following
  //                                      members:
  //                  (string) token        The generated token string.
  //                  (number) exp          The number of seconds since
  //                                        epoch indicating when the given
  //                                        token JWT expires.
  //                                      Otherwise, an Error() instance is
  //                                      thrown.
  // @notes         *This information is typically embedded in the token.
  static generateAuthToken( username, id, type ) {

    let ht = new HandlerTag(
      'generateAuthToken',
      'string'
    ).getTag();
    try {
      
      // Validate type
      if( !( ['access','refresh'].includes(type) ) ) {
        throw new Error(`Invalid token type '${type}'`,ht);
      }
      
      // Configure auth token content (i.e. should contain identifying
      // info, no sensitive data) and metadata
      let payload = { username: username, id: id };
      let currentTime = Date.now()/1000;        // current time in seconds
      let offset = 3600 * AccessControl.tokenTTL[type];  // ttl in seconds
      let expiration = Math.floor( currentTime + offset );

      // Return result
      Logger.log( 'Generating auth token object', ht );
      return {
        token: jwt.sign(
          { exp: expiration, data: payload },
          signKey,
          { algorithm: 'RS256' }
        ),
        exp: expiration
      };
    } catch( exception ) {
      Logger.log(`Token generation failed: ${exception.toString()}`, ht);
      throw exception;
    }
  }
}

// Define static properties
AccessControl.tokenTTL = { // in hours
  access: 1,
  refresh: 24,
};
// END class AccessControl

module.exports = AccessControl;

// END accessControl.js
