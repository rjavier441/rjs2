//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					databaseMySQL.js
//	@Date Created:	2020-02-17
//	@Last Modified:	2020-02-17
//	@Details:
//									Defines a MySQL Database Class.
//	@Dependencies:
//									class DatabaseInterface
//	                NPM Package 'mysql'

'use strict';

// Includes
const DatabaseInterface = require( './interface/databaseInterface.js' );

// BEGIN MysqlResult
class MysqlResult {
  // @ctor
  // @parameters		(mixed) data          The data from a successful query
  //	                                    result.
  //	              (mixed) fields        Supplementary field information (if
  //	                                    any) that came with a successful
  //	                                    result.
  constructor( data, fields ) {
    this.data = data;
    this.fields = fields;
  }
}
// END MysqlResult

// BEGIN class MysqlTableField
class MysqlTableField {
  // @ctor
  // @parameters		(string) name         The column name.
  //	              (string) descriptor   A descriptor string that describes the
  //	                                    columns (can include all valid SQL
  //	                                    data types, key constraints, etc.).
  constructor( name, descriptor ) {
    this.name = name;
    this.descriptor = descriptor;
  }
}
// END class MysqlTableField

// BEGIN class DatabaseMysql
class DatabaseMysql extends DatabaseInterface {

  // @ctor
  // @parameters		(string) hostname     The db hostname/ip address. This
  //	                                    argument can also specify the port to
  //	                                    use by simply prefixing the hostname
  //	                                    with a standard URL port number (i.e.
  //	                                    ':8080'). If no port is specified,
  //	                                    the default mysql port 3306 is used.
  //	              (string) username     The db user identifier.
  //	              (string) password     The db password.
  //	              (string) db           The name of the db to connect to.
  constructor( hostname, username, password, db ) {
    super();

    // Gather arguments
    let hostParts = hostname.split( ':' );
    if( hostParts.length < 1 || hostParts[0] === '' ) {
      throw new Error( `Invalid hostname "${hostname}"` );
    } else {
      this.hostname = hostParts[0];
    }
    if( hostParts.length === 2 && !isNaN( parseInt( hostParts[1] ) ) ) {
      this.port = parseInt( hostParts[1] );
    } else {
      this.port = 3306;
    }
    this.username = username.toString();
    this.password = password.toString();
    this.db = db.toString();
  }
  
  // @function			create()
  // @description		Creates a table in the associated database.
  // @parameters		(string) name         The name of the table to create.
  //	              (MysqlTableField[]) fields
  //	                                    An array of field descriptor objects.
  //	              (~bool) force         Controls searching for existing table
  //	                                    names when making this table. If
  //	                                    omitted, this defaults to false.
  // @returns				(Promise) promise     A promise that runs the table creation
  //	                                    routine. On success, the resolve call-
  //	                                    back receives an instance of class
  //	                                    MysqlResult. On failure, the rejection
  //	                                    catcher will recieve an instance of
  //	                                    class Error.
  create( name, fields, force = false ) {

    return new Promise( ( resolve, reject ) => {

      try {

        // Argument validation
        if(
          typeof name !== 'string' ||
          !Array.isArray( fields ) ||
          fields.length < 1
        ) {
          reject( new TypeError( 'Invalid argument(s) given' ) );
        }
    
        // Traverse the fields
        let fieldStr = '';
        fields.forEach( ( field ) => {
          // Parse each field
          if( fieldStr.length > 0 ) {
            fieldStr += ', ';
          }
          fieldStr += `\`${field.name}\` ${field.descriptor}`;
        } );
    
        // Create query
        let conn = this.getConnection();
        let q = `CREATE TABLE ${ !force ? 'IF NOT EXISTS ' : ''}`;
        q += `\`${conn.escape(this.db)}\`.\`${conn.escape(name)}\` `;
        q += `(${conn.escape(fieldStr)})`;

        // Submit query
        conn.connect();
        conn.query( q, ( error, results, fields ) => {
          if( error ) {
            if( !( error instanceof Error ) ) {
              error = new Error( error );
            }
            reject( error );
          } else {
            resolve( new MysqlResult( results, fields ) );
          }
        } );
        conn.end();
      } catch( exception ) {
        reject( exception );
      }
    } );
  }

  // @function			delete()
  // @description		Utility to delete rows from the database
  // @parameters		(string) table        The name of the table to delete from.
  //	              (string) qualifier    The qualifier expression that filters
  //	                                    what will be deleted.
  // @returns				(Promise) promise     A promise that runs the table creation
  //	                                    routine. On success, the resolve call-
  //	                                    back receives an instance of class
  //	                                    MysqlResult. On failure, the rejection
  //	                                    catcher will recieve an instance of
  //	                                    class Error.
  delete( table, qualifier ) {
    
    return new Promise( ( resolve, reject ) => {

      try {

        // Argument validation
        if( typeof table !== 'string' || typeof qualifier !== 'string' ) {
          reject( new TypeError( 'Invalid argument(s) given' ) );
        }
      } catch( exception ) {
        reject( exception );
      }
    } );
  }

  // @function			escape()
  // @description		A forward reference to the Mysql escape function.
  // @parameters		(string) input        The string to escape.
  // @returns				(string) output       The esacped string.
  escape( input ) {
    return this._sql.escape( input );
  }

  // @function			getConnection()
  // @description		Provides a MySQL connection object for sql usage.
  // @parameters		n/a
  // @returns				(Connection) conn     A connection object that can be used
  //	                                    to connect to the MySQL database.
  getConnection() {

    // // DEBUG
    // console.log( 'this:', this );
    // console.log( 'this._sql:', this._sql );
    // console.log( 'this._sql.createConnection:', this._sql.createConnection );

    return this._sql.createConnection( {
      host: this.hostname,
      user: this.username,
      password: this.password,
      database: this.db
    } );
  }

  // TODO: Create required methods
  drop() {}
  getInstance() {}
  insert() {}
  query() {}
  update() {}
}

// @property			_sql
// @description		A reference to the MySQL library. Used for dependency
//	              injection.
DatabaseMysql.prototype._sql = null;

// @property			db
// @description		The name of the db to connect to.
DatabaseMysql.prototype.db = null;

// @property			hostname
// @description		The db hostname/ip address.
DatabaseMysql.prototype.hostname = null;

// @property			username
// @description		The db username to use when connecting.
DatabaseMysql.prototype.username = null;

// @property			password
// @description		The db password to use when connecting.
DatabaseMysql.prototype.password = null;

// @property			port
// @description		The db port to use when connecting.
DatabaseMysql.prototype.port = null;

// @property			type
// @description		The type of database. This defaults to mysql.
DatabaseMysql.prototype.type = 'mysql';
// END class DatabaseMysql

module.exports = ( mysql ) => {
  DatabaseMysql.prototype._sql = mysql;
  return {
    DatabaseMysql: DatabaseMysql,
    MysqlTableField: MysqlTableField,
    MysqlResult: MysqlResult
  };
};

// END databaseMySQL.js
