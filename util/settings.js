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
const DependencyInjectee = require( './class/dependencyInjectee.js' );

class ServerSettings extends DependencyInjectee {

  // @ctor
  // @parameters		n/a
  constructor() {
    super();

    // Sets the time to live (in minutes) for cookies/tokens before expiration
    this.cookieLifetime = 60 * 6;   // 6 hours

    // Toggles the availability of development features
    this.devMode = true;

    // The hostname for the server
    this.hostname = "";
    
    // The directory under which the server stores its log files under
    this.logdir = __dirname + "/../log";

    // Various metadata for the server
    this.meta = {
      serverEmail: "",
      serverName: "rjserver2"
    };
    
    // The default port to run the server in
    this.port = 443;
    
    // The public content root directory where publicly accessible content will
    // be stored (a.k.a. the "Server Root")
    this.root = __dirname + "/../public";

    // The server's directory (a.k.a. the "Server Path")
    this.serverPath = __dirname.substring( 0, __dirname.indexOf( '/util' ) );

    // The server's SSL/HTTPS config file
    this.ssl = __dirname + "/common/security/security.json";

    // The directory where EJS templates for the TemplateManager class are kept
    this.templateDir = __dirname + "/common/template";

    // The directory under which the server can find its utility classes/
    // libraries
    this.util = __dirname;
  }
};

module.exports = new ServerSettings();

// END settings.js