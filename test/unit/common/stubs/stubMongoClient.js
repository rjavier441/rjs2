//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					stubMongoClient.js
//	@Date Created:	2019-11-10
//	@Last Modified:	2019-11-10
//	@Details:
//									Defines a stub of the MongoClient class.
//	@Dependencies:
//									n/a

'use strict';

class MongoConnection {
  constructor() {}
}

// BEGIN class MongoClient
class MongoClient {

  // @ctor
  // @parameters		(string) url          The URL to connect to.
  constructor( url ) {
    this.url = url;
    this.connection = new MongoConnection();
  }

  // @function			connect()
  // @description		Connects to db
  // @parameters		(function) cb         A callback function. It is passed a
  //	                                    single argument:
  //	                (mixed) error         This is an object if there was a
  //	                                      connection issue. Otherwise, it is
  //	                                      null.
  //	                                      
  // @returns				n/a
  connect( cb ){
    cb(null);
  }

  // @function			db()
  // @description		Returns a reference to the connected database.
  // @parameters		n/a
  // @returns				(object) connection   A MongoClient db object
  db() {
    return this.connection;  // return connection object as stub
  }
}
// END class MongoClient

module.exports = { MongoClient, MongoConnection };

// END stubMongoClient.js
