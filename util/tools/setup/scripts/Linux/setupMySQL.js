//	@PROJECT:				rjs2
//	@Name:				  R. Javier
//	@File:					setupMySQL.js
//	@Date Created:	2020-06-19
//	@Last Modified:	2020-06-19
//	@Details:
//									Defines a routine to setup the server's MySQL database
//	@Dependencies:
//									NodeJS v8+
//                  An already installed and running MySQL Daemon

'use strict';

// BEGIN includes
const _lib_optin = require( '../../../../_lib_optin.js' );
const _lib = {
  // Top-Level Libraries
  settings: require( _lib_optin.settings ),
  ColorLogger: require( _lib_optin.ColorLogger ),
  MysqlUtil: require( _lib_optin.MysqlUtil ),
  
  // rjs Classes
  Class: {
    HandlerTag: require( _lib_optin.Class.HandlerTag ),
    ServerError: require( _lib_optin.Class.ServerError ),
    ServerResponse: require( _lib_optin.Class.ServerResponse )
  }
};
const mysql = require('mysql');
const {execSync} = require('child_process');
// END includes

// BEGIN script
// @function			script()
// @description		The script to run
// @parameters		n/a
// @returns				(mixed) result        The result of the script. If successful,
//	                                    bool true is returned. If unsuccessful,
//	                                    a ServerError object is returned.
function script() {
  let logStyle = {
    stepHeader: { theme: 'primary', style: [ 'bold' ] }
  };
  let result = true;
  let credentials = false;

  _lib.ColorLogger.log(
    "Setting up rjs2 MySQL database...",
    logStyle.stepHeader
  );
  try {

    // Load credentials and build query
    credentials = _lib.MysqlUtil.credentials();
    let q = `CREATE DATABASE IF NOT EXISTS ${credentials.database}`;

    // Begin by ensuring a mysql instance is installed and running 
    _lib.ColorLogger.log( 'Checking for MySQL instance...' );
    let outputTxt = execSync('ps -a | grep mysqld');  // fails if the child
                                                      // process error code is
                                                      // non-zero
    
    // Create the database if it doesn't already exist (fails if the child
    // process error code is non-zero)
    _lib.ColorLogger.log( 'Creating rjs2 database (if non-existent)...' );
    execSync(`mysql -u ${credentials.user} -h"${credentials.host}" -p"${credentials.password}" -e "${q}"`);

    _lib.ColorLogger.log( '\tDone' );

  } catch( exception ) {  // instanceof Error = true
  
    // // DEBUG
    // _lib.ColorLogger.log( 'exception keys: ' + Object.keys( exception ) );
    // _lib.ColorLogger.log( 'status:' + exception.status );
    // _lib.ColorLogger.log( 'signal:' + exception.signal );
    // _lib.ColorLogger.log( 'output:' + exception.output );
    // _lib.ColorLogger.log( 'pid:' + exception.pid );
    // _lib.ColorLogger.log( 'stdout:' + exception.stdout );
    // _lib.ColorLogger.log( 'stderr:' + exception.stderr );

    // Filter out emsg (prevent sensitive info like db password from showing
    // after a failed db creation query)
    let emsg = exception.toString();
    if( !emsg.includes(' grep ') ) {
      emsg = 'CREATE DATABASE query failed?';
    }

    // Return ServerError
    result = new _lib.Class.ServerError(
      `Failed to setup rjs2 MySQL database: ${emsg}\n` +
      `Are you sure you have mysql installed and running?`
    );
  }

  return result;
}
// END script

module.exports = script;

// END setupMySQL.js
