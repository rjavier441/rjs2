//	@PROJECT: 			MEANserver
// 	@Name: 					R. Javier
// 	@File: 					datetimes.js
// 	@Date Created: 	2018-01-31
// 	@Last Modified:	2020-02-01
// 	@Details:
// 									This file contains a suite of utility functions meant to
// 									perform various manipulations and comparisons with datetimes
// 									(i.e. JavaScript date objects).
// 	@Dependencies:
// 									n/a

"use strict";

// Includes
const _lib = require('./_lib_optin.js')._optin( [
	'settings',
	'Logger'
] );

// Container
var datetimes = {};



// BEGIN member functions
// @function			format()
// @description		This function generates a datetime string in the given format.
// @parameters		(Date) date						The Javascript Date object to use.
//								(~string) format			The date format to use. Supported date
//																			formats include:
//
//																				'ymd' - YYYY-MM-DD
//																				'ymdhms' - YYYY-MM-DD HH:MM:SS
//																				'ymdhmso' - YYYY-MM-DD HH:MM:SS UTC+/-
//
//																			If omitted, this defaults to 'ymd'.
// @returns				(string) str					The resulting date string
datetimes.format = function( date = new Date( Date.now() ), format = 'ymd' ) {

	let str = '';
	let day = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;
	let month = `${(date.getMonth() + 1) < 10 ? '0' : ''}${date.getMonth() + 1}`;
	let year = date.getFullYear().toString();
	let hours = `${date.getHours() < 10 ? '0' : ''}${date.getHours()}`;
	let minutes = `${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
	let seconds = `${date.getSeconds() < 10 ? '0' : ''}${date.getSeconds()}`;
	let tzOffset = date.getTimezoneOffset();	// in minutes
	let tzHours = Math.floor(tzOffset / 60);
	let tzMinutes = tzOffset % 60;
	
	switch( format ) {
		case 'ymd': {
			str = `${year}-${month}-${day}`;
			break;
		}
		case 'ymdhms': {
			str = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			break;
		}
		case 'ymdhmso': {
			str = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
			str += `${tzOffset < 0 ? '+' : '-'}`;
			str += `${tzHours < 10 ? '0' : ''}${tzHours}:`;
			str += `${tzMinutes < 10 ? '0' : ''}${tzMinutes}`;
			break;
		}
		default: {
			throw new Error(
				`datetimes.format(): Unsupported date format "${format}"`
			);
		}
	}

	return str;
};

/*
	@function 	hasPassed
	@parameter 	date - the JavaScript date object to check against the current date
	@returns 	true if the date is passed; false otherwise
	@details 	This function determines if a the specified date has passed
*/
datetimes.hasPassed = function (date) {
	var handlerTag = {"src": "datetimes.hasPassed"};
	var now = new Date(Date.now());
	var expired = false;

	if ((now - date) > 0) {	// i.e. current date is passed the given date
		expired = true;
	}

	return expired;
};

/*
	@function 	niceDateStr
	@parameter 	date - a JavaScript date object
	@parameter 	separator - any character or string to separate the different elements of the date (defaults to "-")
	@returns 	a date string in the format "mm-dd-yyyy" where "-" separators can be replaced by the specified separator character
	@details 	This generates a neat date string that is customized with any specified separator character or string 
*/
datetimes.niceDateStr = function (date, separator = "-") {
	var handlerTag = {"src": "datetimes.niceDateStr"};
	var month = (9 < date.getMonth() + 1) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
	var day = (9 < date.getDate()) ? `0${date.getDate()}` : `${date.getDate()}`;
	var year = `${date.getFullYear()}`;
	return `${month}${separator}${day}${separator}${year}`;
};

/*
	@function 	niceTimeStr
	@parameter 	date - a JavaScript date object
	@parameter 	separator - any character or string to separate the different elements of the time (defaults to ":")
	@returns 	a date string in the format "hh:mm:ss" where ":" separators can be replaced by the specified separator character
	@details 	This generates a neat date string that is customized with any specified separator character or string 
*/
datetimes.niceTimeStr = function (date, separator = ":") {
	var handlerTag = {"src": "datetimes.niceTimeStr"};
	var hour = `${date.getHours()}`;
	var minute = `${date.getMinutes()}`;
	var second = `${date.getSeconds()}`;
	return `${hour}${separator}${minute}${separator}${second}`;
};
// END member functions


module.exports = datetimes;

// END datetimes.js
