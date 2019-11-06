//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					database.js
//	@Date Created:	2019-11-01
//	@Last Modified:	2019-11-01
//	@Details:
//									Defines a generic object to represent a database. This class
//	                is purely informational; it serves as nothing more than a
//	                data structure to represent the necessary parameters of a
//	                database.
//	@Dependencies:
//									n/a

'use strict';

// BEGIN class Database
class Database {
  // @ctor
  // @parameters		(string) name       The name of the database.
  //	              (string) type       The type of database this object is
  //	                                  representing. Valid types include:
  //
  //                                    'relational'  (i.e. SQL databases)
  //                                    'docstore'    (i.e. MongoDB)
  //	              (string) url        The full URL to the database for use in
  //	                                  establishing a connection (i.e. includes
  //	                                  any service names, username/pwd, ip, and
  //	                                  port numbers, or any relevant parameters
  //	                                  to establish a database connection).
  constructor( name, type, url ) {
    this.name = name;
    this.type = type;
    this.url = url;
  }
}
// END class Database

module.exports = Database;

// END database.js
