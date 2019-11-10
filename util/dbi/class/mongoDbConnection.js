//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					mongoDbConnection.js
//	@Date Created:	2019-11-03
//	@Last Modified:	2019-11-03
//	@Details:
//									Defines a singleton class that allows the user to acquire a
//	                single MongoDB client connection.
//	@Dependencies:
//									MongoClient
//	                database.js

'use strict';
const DependencyInjectee = require('../../class/dependencyInjectee.js');

// BEGIN class MongoDbConnection
class MongoDbConnection extends DependencyInjectee {
  // @ctor
  // @parameters		(object) deps         An object containing the dependencies
  //	                                    required by the object instance. This
  //	                                    supports dependency injection.
  //	              (string) database     The name of the database to connect
  //	                                    to.
  //	              (string) hostname     The hostname to connect to.
  //	              (number) port         The port to connect to. This defaults
  //	                                    to MongoDB's default port 27017.
  //	              (~string) user        The username to use when
  //	                                    authenticating. If omitted, it is
  //	                                    assumed that you are connecting to an
  //	                                    unsecured database.
  //	              (~string) pwd         The password to use when
  //	                                    authenticating. If omitted, it is
  //	                                    assumed that you are connecting to an
  //	                                    unsecured database.
  constructor(
    deps,
    database,
    hostname,
    port = 27017,
    user = false,
    pwd = false
  ) {

    // Load dependencies
    super( deps );

    // Generate credential string if required
    var credentialStr = '';
    if( user && pwd ) {
      credentialStr = 
        `${encodeURIComponent(user)}:${encodeURIComponent(pwd)}@`;
    }

    // Define properties
    this.client = false;
    this.connection = false;
    this.dbInfo = new this._dep.Database(
      database,
      'docstore',
      `mongodb://${credentialStr}${hostname}:${port}/${database}`
    );
  }

  // @function			connect()
  // @description		Attempts to connect to the database.
  // @parameters		(function) cb         The callback function to run. The
  //	                                    callback function is bound to this
  //	                                    MongoDbConnection instance. It is
  //	                                    passed the following arguments:
  //	                (Db) db               The Mongo Db instance resulting from
  //	                                      a successful connection.
  //	                (mixed) error         On success, this value is null.
  //	                                      Otherwise, this is a MongoError.
  // @returns				n/a
  connect( cb ) {

    // Create new client instance
    this.client = new this._dep.MongoClient( this.dbInfo.url );
    this.client.connect( function( error ) {

      if( error === null ) {
        this.connection = this.client.db();
      }

      if( typeof cb === 'function' ) {
        cb.bind(this);
        cb( this.connection, error );
      }
    } );
  }

  // @function			close()
  // @description		Attempts to logout and close the database connection.
  // @parameters		(function) cb         The callback function to run after the
  //	                                    connection closes. It is not passed
  //	                                    any arguments.
  //	              (~bool) forceClose    Controls whether to forcefully close
  //	                                    the connection without emitting any
  //	                                    events. If omitted, this defaults to
  //	                                    false.
  // @returns				n/a
  close( cb, forceClose = false ) {
    this.client.logout();
    this.client.close( forceClose, cb );
  }
}
// END class MongoDbConnection

module.exports = MongoDbConnection

// END mongoDbConnection.js
