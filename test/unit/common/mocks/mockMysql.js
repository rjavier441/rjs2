//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					mockMysql.js
//	@Date Created:	2020-02-22
//	@Last Modified:	2020-02-22
//	@Details:
//									A mock of the mysql NodeJS driver classes.
//	@Dependencies:
//									n/a

'use strict';

// Includes
const fs = require( 'fs' );

// Globals
const staticDb = JSON.parse(
  fs.readFileSync( `${__dirname}/res/staticDb.json`, { encoding: 'utf8' } )
).dbs;

// BEGIN class OkPacket
class OkPacket {
  // @ctor
  // @parameters		(object) packet       The packet contents to pass over.
  constructor( packet ) {
    this.fieldCount = (packet && packet.fieldCount) ? packet.fieldCount : 0;
    this.affectedRows = (packet && packet.affectedRows) ? packet.affectedRows : 0;
    this.insertId = (packet && packet.insertId);
    this.serverStatus = (packet && packet.serverStatus) ? packet.serverStatus : 2;
    this.warningCount = (packet && packet.warningCount) ? packet.warningCount : 0;
    this.message = (packet && packet.message) ? packet.message : '';
    this.protocol41 = (packet && packet.protocol41) ? packet.protocol41 : false;
    this.changedRows = (packet && packet.changedRows) ? packet.changedRows : 0;
  }
}
// END class OkPacket

// BEGIN class FieldPacket
class FieldPacket {
  // @ctor
  // @parameters		(string) name         The name of the column.
  constructor( name ) {
    this.name = name;
  }
}
// END class FieldPacket

// BEGIN class RowDataPacket
class RowDataPacket {
  // @ctor
  // @parameters		(object) row          The row that this packet represents.
  constructor( row ) {
    Object.keys( row ).forEach( ( key ) => {
      this[key] = row[key];
    } );
  }
}
// END class RowDataPacket

// BEGIN class MockMysqlConnection
class MockMysqlConnection {

  // @ctor
  // @parameters		(object) settings     A copy of the settings object from
  //	                                    class MockMysql's constructor.
  constructor( settings ) {
    this.settings = settings;
    this.db = staticDb[ settings.database ];
    this.connectionIsLive = false;
  }

  // @function			connect()
  // @description		Simulates a database connection.
  // @parameters		n/a
  // @returns				n/a
  connect() {
    this.connectionIsLive = true;
  }

  // @function			end()
  // @description		Simulates an database disconnection.
  // @parameters		n/a
  // @returns				n/a
  end(){
    // do nothing...
  }

  // @function			escape()
  // @description		Simulates escaping of a MySQL input value string.
  // @parameters		(mixed) input         The input to escape.
  // @returns				(string) output       The escaped string
  escape( input ) {
    
    let output = input;

    if( typeof input === 'number' ) {
      output = input.toString();
    } else if( typeof input === 'string' ) {

      switch( input ) {
        case 'SELECT * FROM asdf':
          output = '\'SELECT * FROM asdf\'';
          break;
        case '``':
          output = '\'``\'';
          break;
        case ';-- DELETE FROM mysql.user WHERE id IS NOT NULL;':
          output = '\';-- DELETE FROM mysql.user WHERE id IS NOT NULL;\'';
          break;
        default:
          output = input;
      }
    } else if( typeof input === 'object' ) {

      switch( JSON.stringify( input ) ) {
        case '{"asdf":"asdf"}':
          output = '`asdf` = \'asdf\'';
          break;
        default:
          throw new Error( `Unexpected input: ${input}` );
      }
    }

    return output;
  }

  // @function			query()
  // @description		Simulates a database query.
  // @parameters		(string) q            The mysql query.
  //	              (function) cb         The callback to run after the query
  //	                                    finishes. It its given two arguments:
  //	                (Error) error         An error object if something went
  //	                                      wrong.
  //	                (object) result       The result if nothing went wrong.
  //	                (object) fields
  // @returns				n/a
  query( q, cb ) {

    // Remove semicolon, if any
    q = q.replace( ';', '' );
    switch( q ) {
      case "CREATE TABLE IF NOT EXISTS `rjs2`.`test_messages` (`id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT, `userId` varchar(100) NOT NULL, `message` varchar(500))": {

        let results = new OkPacket();
        cb( false, results, undefined );
        break;
      }
      case "SELECT * FROM test_messages": {

        // Format rows into RowDataPackets
        let results = [];
        this.db.tables.test_messages.rows.forEach( ( row ) => {
          results.push( new RowDataPacket( row ) );
        } );

        // Format fields into field data packets
        let fields = [];
        Object.keys( this.db.tables.test_messages.schema.columns ).forEach(
          ( colunmName ) => {
            fields.push( new FieldPacket( colunmName ) );
          }
        );

        cb( false, results, fields );
        break;
      }
      default: {
        cb( new Error( `Unknown mock query: ${q}` ), false, undefined );
      }
    }
  }
}
// END class MockMysqlConnection

// BEGIN class MockMysql
class MockMysql {

  // @ctor
  // @parameters		n/a
  constructor() {}

  // @function			createConnection()
  // @description		Creates a connection to a mysql database.
  // @parameters		(object) settings     An object containing connection info.
  //	                                    It takes the following members:
  //	                (string) host         Hostname of server to connect to.
  //	                (string) user         Username for database.
  //	                (string) password     Password for database.
  //	                (string) database     Name of database to connect to.
  // @returns				(MockMysqlConnection) connection
  createConnection( settings ) {
    return new MockMysqlConnection( settings );
  }
}
// END class MockMysql

module.exports = {
  mysql: new MockMysql,
  Connection: MockMysqlConnection,
  RowDataPacket: RowDataPacket,
  FieldPacket: FieldPacket,
  OkPacket: OkPacket
};

// END mockMysql.js