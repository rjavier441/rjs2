//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					databaseInterface.js
//	@Date Created:	2020-02-17
//	@Last Modified:	2020-02-17
//	@Details:
//									Defines a common interface for database classes.
//	                Classes based off of this interface are intended
//	                to be singletons.
//	@Dependencies:
//									class DependencyInjectableInterface

'use strict';

// Includes
const DependencyInjectableInterface = require(
  './dependencyInjectableInterface.js'
);

// BEGIN class DatabaseInterface
class DatabaseInterface extends DependencyInjectableInterface {

  // @ctor
  // @parameters		(object) deps         See DependencyInjectableInterface
  //	                                    class documentation for more details.
  constructor( deps ) {

    let contract = {
      methods: [
        'create',         // method to create db tables/collections
        'delete',         // method to delete db entries
        'drop',           // method to delete db tables/collections
        'getInstance',    // gets instance of the db singleton
        'insert',         // method to insert db entries
        'query',          // method to search db entries
        'update'          // method to update db entries
      ],
      props: [
        'db',             // name of db to use in this instance
        'hostname',       // db connection hostname/ip address
        'password',       // db connection password
        'port',           // db connection port number
        'type',           // a string naming the db type (i.e. mysql)
        'username'        // db connection username
      ]
    };
    super( contract, deps );
  }
}
// END class DatabaseInterface

module.exports = DatabaseInterface;

// END databaseInterface.js