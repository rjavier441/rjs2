//	@PROJECT: 			rjs2
// 	@Name: 					R. Javier
// 	@File: 					logger.js
// 	@Date Created: 	2019-09-28
// 	@Last Modified: 2020-02-01
// 	@Details:
// 									This file provides server.js with a means to log events to
//									log files in the log directory. Note that this logger library
//									is NOT compatible with RJS v1 and below.
// 	@Dependencies:
// 									NodeJS (using ECMAscript 6 style JS)
//	@Note:
//									It is important to note that the idea of a "const" in JS
//									doesn't mean "is constant", but rather, that "it can only be
//									assigned ONCE", and thus all references to the "logger"
//									singleton are "constant" (i.e. referencing the exact same
//									object in memory). The logger singleton is still, therefore,
//									not immutable, unless frozen with object.freeze().

"use strict"
const fs = require("fs");
const DependencyInjectee = require( './class/dependencyInjectee.js' );
const _lib = require( './_lib_optin.js' )._optin( [
	'settings',
	'DateTimes',
	'Util'
] );


// BEGIN class Logger
class Logger extends DependencyInjectee {

	// @ctor
	// @parameters		(object) deps					An object containing the dependencies
  //	                                    required by the object instance (this
  //	                                    supports dependency injection). Each
  //	                                    key must be the name of a dependency
  //	                                    class (see class Dependencies above).
	constructor( deps ) {
		super( deps );
	}
}

// @property			Logger.prototype.logHeader
// @description		This member defines the heading prepended to each logfile's
//								filename.
Logger.prototype.logHeader = "rjs2-log_";

// @property			Logger.prototype.fileMutex
// @description		This member signals when a file is being written to.
Logger.prototype.fileMutex = true;

// @property			Logger.prototype.dataQueue
// @description		This member is used as a queue for log data if a log was
//								attempted while another log or process had the mutex.
Logger.prototype.dataQueue = ["\n****\nInitializing event log system...\n****\n"];	// queue for data to be written, if logs were requested while a Logger.prototype.fileMutex was unavailable

// @property			Logger.prototype.logToConsole
// @description		If true, this member will force the logger to log its message 
//								to both the logfile and the console. Defaults to true.
Logger.prototype.logToConsole = true;

// @property			Logger.prototype.logContextMessaging
// @description		If true, log context messages and logger errors will be shown;
//								in console. This flag has no effect if `logToConsole` is not
//								true. This defaults to false
Logger.prototype.logContextMessaging = false;

// @property			Logger.prototype.blacklist
// @description		This member is used to list which handlers' messages should 
//								be ignored.			
Logger.prototype.blacklist = [];

// @function			Logger.prototype.ignore()
// @description		This function tells the logger module to ignore certain
//								messages for logging (both to console and to log file). If an
//								message has a handler tag with a "src" attribute whose name
//								is specified within the tagName(s), that message is ignored
//								and not logged.
//								This function has a contextual usage. If no arguments are
//								given, this function returns the current blacklist. If
//								parameter tagNames is given, the specified tagName is added to
//								the message black list, and this function then returns the new
//								blacklist.
// @parameters		(~string[]) tagNames	An (optional) array listing the handler
//																			tag names to ignore.
// @returns				(string[]) blacklist	The current message tags blacklist.
Logger.prototype.ignore = function ( tagNames = [] ) {

	// Add tag names to the current blacklist if they don't already exist in it
	tagNames.forEach( function ( tag ) {

		// Check if the tag already exists. If not, then add it
		if ( !Logger.prototype.blacklist.includes( tag ) ) {

			Logger.prototype.blacklist.push( tag )
		}
	} );

	// Return the latest version of the blacklist
	return Logger.prototype.blacklist;
}

// @function			Logger.prototype.interpret()
// @description		This function tells the logger to interpret certain messages
//								for logging (both to console and to log file) by removing it
//								from the blacklist (if it exists).
// @parameters		(string[]) tagNames		An array listing the handler tag names
//																			to remove from the blacklist.
// @returns				n/a
Logger.prototype.interpret = function ( tagNames ) {

	// If tagNames is not an array, convert it to one
	if ( !Array.isArray( tagNames ) ) {

		// Convert to an array
		tagNames = [ tagNames ];
	}

	// Remove tagNames from the blacklist
	tagNames.forEach( function ( tagName ) {

		// Check if the tagName exists within the array
		var index = Logger.prototype.blacklist.indexOf( tagName );
		if ( index !== -1 ) {

			// Remove the index from the blacklist
			Logger.prototype.blacklist.splice( index, 1 );
		}
	} );
}

/*
	@function	Logger.prototype.log
	@parameter	msg - the string message to log
	@parameter	options - (optional) JSON object of formatting options to customize how @parameter msg is written to the logfile
	@returns	An object detailing the message that was logged (i.e. placed in log queue), and its log settings:
				{
					"timestamp": [message's timestamp],
					"month": [message's log month],
					"day": [message's log day],
					"year": [message's log year],
					"src": [message's source]
				}
	@details 	
				This function is used to record server events in daily logfiles within the log directory (defined in settings.js). The function places the messages in a queue and processes them as they come along. As previously implied, this function will store the message in the log file corresponding to current date that @function Logger.prototype.log was called. If a logfile with today's date does not exist, that log file will be automatically created and piped the message.
				Whenever @function log is called, it automatically tags @parameter msg with a timestamp in front, and places it at the end of the logfile. If options is specified, it may contain any or all of the following:

					{
						"addNL": [true | false],	// if true, automatically appends newline to @parameter msg; defaults to true
						"pad": [unsigned int],	// if > 0, adds the specified amount of newlines before writing the timestamp and msg; useful for placing separators in the logfile. Max is 50.
						"src": [string]	// if defined, adds this string before writing the msg; useful for indicating where the message is being logged from
					}
	@notes
				The logfiles will be named in this format: [Logger.prototype.logHeader][current_date].
				In contrast to log file logging, all console.log() calls may or may not appear in the server console in the order they are written
*/
Logger.prototype.log = function (msg, options = {
	"addNL": false,
	"pad": 0,
	"src": undefined
}) {
	// Determine current time information
	var date = new Date();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var year = date.getFullYear();
	var timestamp = "[" + _lib.DateTimes.format( date, 'ymdhmso' ) + "] ";
	var padding = "";
	var sourceTag = "";

	// Handle options
	msg += (typeof options.addNL !== "undefined" && options.addNL === false) ? "" : "\n";
	if (typeof options.pad !== "undefined" && options.pad > 0) {
		for (var i = 0; i < options.pad; i++) {
			padding += "\n";
		}
	}
	sourceTag = (typeof options.src !== "undefined") ? `<${options.src}> ` : "";

	// Determine if the message source is in the blacklist
	var srcIsBlacklisted = Logger.prototype.blacklist.includes( options.src );

	// Place msg in log queue if the log src is not blacklisted
	if ( !srcIsBlacklisted ) {

		// If the log src is not blacklisted, place the message on the queue
		Logger.prototype.dataQueue.push(padding + timestamp + sourceTag + msg);
	}

	// Set the message's detailed info
	var detailedInfo = {
		"timestamp": timestamp,
		"month": month,
		"day": day,
		"year": year,
		"src": options.src
	};

	// If this message's tag is in the black list, don't log it or print it out at all!
	if ( srcIsBlacklisted ) {
		detailedInfo.ignored = true;
	}

	// If no other process is using the file, take the file mutex so that no other log call can write. Then, flush all messages.
	if (Logger.prototype.fileMutex === true && !srcIsBlacklisted ) {
		// Take mutex
		Logger.prototype.fileMutex = false;

		// Create date string for filename
		var datestr = "";
		datestr += year.toString();
		datestr += "-" + ((month < 10) ? "0" + month.toString() : month.toString());
		datestr += "-" + ((day < 10) ? "0" + day.toString() : day.toString());

		// Create (absolute) filepath to search for
		var filename = `${Logger.prototype.logHeader}${datestr}`;
		var filepath = `${_lib.settings.logdir}/${filename}`;

		// Flush dataQueue message(s) to logfile
		while (Logger.prototype.dataQueue.length > 0) {
			var msgFromQueue = Logger.prototype.dataQueue.shift();	// removes from front of array
			fs.appendFile(filepath, msgFromQueue + '\n', "utf8", function (error) {
				if (error) {
					if (Logger.prototype.logToConsole === true) {
						var contextMessage = Logger.prototype.logContextMessaging ? 
							`(Log Error occurred for ${filename}) [UNLOGGED] ` : '';
						var consoleMsgFromQueue = msgFromQueue.replace( '[', '[\x1b[31m')
							.replace( ']', '\x1b[0m]');
						
						if( sourceTag.length > 0 ) {
							consoleMsgFromQueue = consoleMsgFromQueue.replace(
								' <', ' <\x1b[33m' ).replace( '>', '\x1b[0m>');
						}
						console.log(`${contextMessage}${consoleMsgFromQueue}`);
					}
				} else {
					if (Logger.prototype.logToConsole === true) {
						var contextMessage = Logger.prototype.logContextMessaging ?
						`(Logged to ${filename} from queue) ` : '';
						var consoleMsgFromQueue = msgFromQueue.replace( '[', '[\x1b[32m')
							.replace( ']', '\x1b[0m]');
							
						if( sourceTag.length > 0 ) {
							consoleMsgFromQueue = consoleMsgFromQueue.replace(
								' <', ' <\x1b[33m' ).replace( '>', '\x1b[0m>');
						}
						console.log(`${contextMessage}${consoleMsgFromQueue}`);
					}
				}
			});
		}

		// Return mutex
		Logger.prototype.fileMutex = true;
	}

	// Return background information about this log message
	return detailedInfo;
}
// END class Logger

module.exports = new Logger();

// END logger.js
