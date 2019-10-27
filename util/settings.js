//	@PROJECT:				rjs2
//	@Name:						R. Javier
//	@File:						settings.js
//	@Date Created:		2019-10-06
//	@Last Modified:	2019-10-06
//	@Details:
//									Contains configuration settings for the entire project.
//	@Dependencies:
//									n/a

"use strict";

const defaults = {
  // Sets the time to live (in minutes) for cookies/tokens before expiration
  cookieLifetime: 60 * 6,   // 6 hours

  // Toggles the availability of development features
  devMode: true,

  // The hostname for the server
  hostname: "",
  
  // The directory under which the server stores its log files under
  logdir: __dirname + "/../log",

  // Various metadata for the server
  meta: {
    serverEmail: "",
    serverName: "rjserver2"
  },
  
  // The default port to run the server in
  port: 443,
  
  // The public content root directory where publicly accessible content will be
  // stored (a.k.a. the "Server Root")
  root: __dirname + "/../public",

  // The server's directory (a.k.a. the "Server Path")
  serverPath: __dirname.substring( 0, __dirname.indexOf( '/util' ) ),

  // The server's SSL/HTTPS config file
  ssl: __dirname + "/common/security/security.json",

  // The directory under which the server can find its utility classes/libraries
  util: __dirname
};

module.exports = defaults;

// END settings.js