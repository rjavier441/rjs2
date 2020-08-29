//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					mysqlUtil.js
//	@Date Created:	2020-03-17
//	@Last Modified:	2020-03-17
//	@Details:
//									Defines a suite of mysql database utility functions.
//	@Dependencies:
//									JavaScript ECMAScript 6
//	                NPM mysql library

'use strict';

// Includes
const settings = require( './settings.js' );
const fs = require( 'fs' );

// BEGIN class MysqlUtil
class MysqlUtil {
  // @ctor
  // @parameters		n/a
  constructor() {}
  
  // @function			credentials()
  // @description		Provides access to the database's credentials.
  // @parameters		n/a
  // @returns				(object) result       The database's credentials, used to
  //	                                    crate connections.
  static credentials() {

    return JSON.parse( fs.readFileSync(
      `${settings.util}/common/security/mysql.json`,
      { encoding: 'utf8' }
    ) );
  }

  // @function			terminateConnection()
  // @description		Attempts to close a connection to the MySQL database.
  // @parameters		(Connection) conn     A reference to a MySQL connection.
  //	              (bool) status         A boolean that recorded whether the
  //	                                    connection was last known as alive.
  // @returns				(bool) state          The new connection status once closed.
  static terminateConnection( conn, status ) {

    // End connection
    if( conn && status ) {
      conn.end();
      status = false;
    }

    return status;
  }
}
// END class MysqlUtil

module.exports = MysqlUtil;

// END mysqlUtil.js
