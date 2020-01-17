//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					autoloader.js
//	@Date Created:	2020-01-10
//	@Last Modified:	2020-01-10
//	@Details:
//									Created to replace the previous route loading system, this
//	                file contains a suite of functions used by the server to
//	                handle both loading of static content to public-facing URIs
//	                and mapping of custom logic to RESTful API endpoints.
//	@Dependencies:
//									NodeJS v8.9.1+
//									ExpressJS v4+
// 					        body-parser		    (NPM middleware req'd by ExpressJS 4.x
//	                                  to acquire POST data parameters:
//	                                  "npm install --save body-parser")

'use strict';

// Includes
const settings = require( './settings.js' );
const configFileName = '_alconfig.json';
const DependencyInjectee = require(
  `${settings.util}/class/dependencyInjectee.js`
);

// Dependencies
// const ejs = require( 'ejs' );
// const fs = require( 'fs' );
// const HandlerTag = require( `${settings.util}/class/handlerTag.js` );
// const Logger = require( `${settings.util}/logger.js` );
// const ServerError = require( `${settings.util}/class/serverError.js` );
// const ServerResponse = require( `${settings.util}/class/serverResponse.js` );
// const Util = require( `${settings.util}/util.js` )

// BEGIN Autoloader Config Documentation
// @config        _alconfig.json
// @description   A file that configures the way Autoloader handles the contents
//	              of the containing directory. The Autoloader class recursively
//	              traverses the filesystem from the given root path, then loads
//	              and mounts content contextually based on the existense of this
//	              file. When traversing the filesystem, the Autoloader follows a
//	              Depth-First Traversal method, but DOES NOT follow links. The
//	              loading follows these rules:
//
//	                1.) If this file does not exist within the current
//	                    directory, the Autoloader will treat all files in the
//	                    current directory as static content, and therefore serve
//	                    them publicly without restriction.
//	                2.) If this file exists within the current directory, the
//	                    Autoloader will use the parameters in the file to
//	                    determine how to treat files and directories within the
//	                    given directory.
//
//	              With this file, the developer can control the naming of files
//	              and directories viewable to the public (via alias parameter),
//	              and what child directories are included/excluded (via include
//	              and/or exclude parameters).
// @note          The term "current directory" is used throughout the rest of
//	              this documentation to represent the directory that the
//	              Autoloader class's recursive procedure has currently entered.
// @note          Static content will be mounted via GET requests ONLY (this may
//	              change in the future). 
// @parameters    (~object) alias       A map of aliases, where keys represent
//	                                    the names of files and directories
//	                                    within the current directory, and values
//	                                    are the aliases to these files and
//	                                    directories. If omitted, no aliases will
//	                                    be used, and endpoint routing will use
//	                                    the actual names of the files and
//	                                    directories.
//                (~object) include     A map serving as a whitelist of file
//	                                    and/or directory names within the
//	                                    current directory. Keys represent the
//	                                    names of items to include. If provided
//	                                    alongside the "exclude" parameter,
//	                                    "exclude" is ignored.
//                (~object) exclude     A map serving as a blacklist of file
//	                                    and/or directory names within the
//	                                    current directory. Keys represent the
//	                                    names of items to exclude. If provided
//	                                    alongside the "include" parameter, this
//	                                    parameter is ignored.
//	              (~object) apps        A map of directory names to paths of
//	                                    app/router middleware files (relative to
//	                                    the current directory) that will handle
//	                                    all endpoints under the corresponding
//	                                    directory name. If this argument is
//	                                    omitted, content is treated as static
//	                                    web content and exposed to the public
//	                                    based on the provided alias, include and
//	                                    exclude parameters. If this argument is
//	                                    given, the specified app/router
//	                                    middleware file will be routed to the
//	                                    current endpoint, and no further
//	                                    depth-first traversal will occur for the
//	                                    current directory.
// @example
//	              Given the following directory structure:
//
//	                + public/
//									|---- app1/
//									|			|---- index.html
//									|
//									|---- app2/
//									| 		|---- index.html
//									| 		|---- test.html
//									| 		|
//									| 		|---- dir1/
//									| 		|			|----index.js
//									| 		|			|----index.css
//									| 		|
//									| 		|---- dir2/
//									|						|----img.jpg
//									|
//									|---- api1/
//									  		|---- app.js
//	                      |
//									  		|---- dir1/
//									  		|     |---- some.img
//									  		|     |---- some.jpg
//									  		|
//									  		|---- dir2/
//									  		      |---- some.js
//
//	              Assume the goal is to treat app1/ and app2/ as static content,
//	              and treat api1/ as a middleware-controlled directory. Also
//	              assume that app2/ will be aliased as "home", and app2/dir2
//	              and test.html will be excluded from mounting.
//
//                ========
//                "/app1":
//                ========
//	              To treat app1 as static content, no action needs to be taken.
//	              Autoloader automatically treats an entire directory as static
//	              content if no config file "_alconfig.json" exists.
//
//                ========
//                "/app2":
//                ========
//	              To treat app2 as static content and exclude an entire
//	              directory and file, app2 needs to contain the config file
//	              "_alconfig.json" to signal this behavior. Create the file
//                in "public/app2/"and add the following:
//
//                  {
//                    "exclude": {
//                      "dir2": false,
//                      "test.html": false
//	                  }
//	                }
//
//	              To set app2's alias, create the config file "_alconfig.json"
//	              in "public/" and add the following:
//
//	                {
//	                  "alias": {
//	                    "app2": "home"
//	                  }
//	                }
//
//                ========
//                "/api1":
//                ========
//                To treat api1 as a middleware-controlled directory, create the
//	              config file "_alconfig.json" under "public/" and add the
//	              following:
//
//	                {
//	                  "apps": {
//	                    "api1": "api1/app.js"
//	                  }
//	                }
// END Autoloader Config Documentation

// BEGIN class Autoloader
class Autoloader extends DependencyInjectee {

  // @ctor
  // @parameters		n/a
  constructor( deps ) {
    super( deps );
  }

  // @function			loadRootFrom()
  // @description		This function sets and loads all web content recursively
  //	              from the given directory, using the appropriate logic when
  //	              encountering the corresponding directory type: API or
  //	              static resource directory. See the Config Documentation for
  //	              more details.
  // @parameters		(object) app          The ExpressJS App/Router to mount all
  //	                                    child routes to.
  //	              (string) root         The root directory containing all
  //	                                    content to expose. This must be a full
  //	                                    path
  // @returns				n/a
  loadRootFrom( app, root ) {

    let ht = new this._dep.HandlerTag(
      'Autoloader.loadRootFrom()',
      'string'
    ).getTag();

    try {

      // DEBUG
      this._dep.Logger.log( `Loading from "${root}"`, ht );

      this.traverse( app, '/', root );

      this.mountNotFound( app );
    } catch( exception ) {

      let msg = new this._dep.ServerError( 'Exception', {
        exception: exception
      } );
      this._dep.Logger.log(
        `Failed to load root from ${root}: ` +
        `${msg.eobj.exception.name}: ${msg.eobj.exception.message}`,
        ht
      );
      throw msg.asString();
    }
  }

  // @function			mountMiddleware()
  // @description		This function mounts the given middleware controller file to
  //	              the given endpoint.
  // @parameters		(object) app          The ExpressJS app/router to map the
  //	                                    given asset to. This type of object is
  //	                                    typically returned from a call to
  //	                                    "express()" or "express.Router()".
  //	              (string) mount        The endpoint to mount middleware to.
  //	              (string) file         The path to the middleware file.
  // @returns				n/a
  mountMiddleware( app, mount, file ) {

    let ht = new this._dep.HandlerTag(
      'Autoloader.mountMiddleware()',
      'string'
    ).getTag();

    try {

      // DEBUG
      this._dep.Logger.log( `Mounting middleware "${file}" to ${mount}`, ht );

      app.use( mount, require( file ) );
    } catch( exception ) {
      
      let msg = new this._dep.ServerError( 'Exception', {
        exception: exception
      } );
      this._dep.Logger.log(
        `Failed to mount ${mount}: ` +
        `${msg.eobj.exception.name}: ${msg.eobj.exception.message}`,
        ht
      );
      throw msg.asString();
    }
  }

  // @function			mountNotFound()
  // @description		This function adds a general purpose "404" Endpoint if all
  //	              other routes fail.
  // @parameters		n/a
  // @returns				n/a
  mountNotFound( app ) {

    let ht = new this._dep.HandlerTag(
      'Autoloader.mountNotFound()',
      'string'
    ).getTag();

    try {
      
      // DEBUG
      this._dep.Logger.log( `Mounting general 404 endpoint`, ht );

      app.use( ( request, response, next ) => {
        
        this._dep.Logger.log(
          `Not Found: ${request.ip} requested ${request.path}\n` +
          `Raw Headers:\n${request.rawHeaders}`,
          ht
        );

        // Send a 404 message in the appropriate manner
        response.status(404);
        if( request.accepts('html') ) {
          response.send( this._dep.TemplateManager.generate(
            'error',
            {
              errorCode: 404,
              errorTitle: 'Not Found   ◉_◉',
              errorMessage: 'Uh Oh! Looks like we couldn\'t find what you ' +
                            'were looking for...'
            }
          ) ).end();
          return;
        }
        if( request.accepts('json') ) {
          response.send(
            new this._dep.Class.ServerError( 'Not Found', {}, 404 )
          ).end();
          return;
        }

        response.type('txt').send(
          ( new this._dep.Class.ServerError( 'Not Found', {}, 404 ) ).asString()
        ).end();
      } );
    } catch( exception ) {
      
      let msg = new this._dep.ServerError( 'Exception', {
        exception: exception
      } );
      this._dep.Logger.log(
        `Failed to mount "Not Found" general endpoint: ` +
        `${msg.eobj.exception.name}: ${msg.eobj.exception.message}`,
        ht
      );
      throw msg.asString();
    }
  }

  // @function			mountStaticContent()
  // @description		This function mounts the given file to the given endpoint as
  //	              static content.
  // @parameters		(object) app          The ExpressJS app/router to map the
  //	                                    given asset to. This type of object is
  //	                                    typically returned from a call to
  //	                                    "express()" or "express.Router()".
  //	              (string) mount        The endpoint to mount the asset under.
  //	              (string) file         The path to the file.
  // @returns				n/a
  mountStaticContent( app, mount, file ) {

    let ht = new this._dep.HandlerTag(
      `Autoloader.mountStaticContent()`,
      'string'
    ).getTag();

    try {
      // DEBUG
      this._dep.Logger.log(
        `Mounting static content "${file}" to ${mount}`,
        ht
      );

      // Mount static content with a GET
      app.get( mount, ( request, response ) => {

        let ht = new this._dep.HandlerTag(
          `Autoloader.mountStaticContent() (${mount})`,
          'string'
        ).getTag();
  
        // Send file with automated content-type inference
        response.sendFile(
          file,
          {
            root: '/',  // specifies start path of 'file' (i.e. 'file' prefix)
            dotfiles: 'deny',
            headers: {
              'x-timestamp': Date.now(),
              'x-sent': true
            }
          },
          ( error ) => {
            if( error ) {
  
              let errorPacket = new this._dep.ServerError( error );
              this._dep.Logger.log(
                `Failed to send ${file} to client @ ip ` +
                `${request.ip}: ${errorPacket.asString()}`,
                ht
              );
              response.status(500).send(
                new this._dep.ServerError( 'Failed to send content' )
              ).end();
            } else {
              
              this._dep.Logger.log(
                `Sent ${file} to client @ ip ${request.ip}`,
                ht
              );
              response.status(200).end();
            }
          }
        );
      } );

      // Handle dot file requests
      let dotfile = mount + '/.';
      app.get( dotfile, ( request, response ) => {

        let ht = new this._dep.HandlerTag(
          `Autoloader.mountStaticContent() (${dotfile})`,
          'string'
        ).getTag();

        let errorObject = new this._dep.Class.ServerError(
          'Forbidden',
          {},
          403
        );

        this._dep.Logger.log(
          `Forbidden: ${request.ip} requested ${request.path}\n` +
          `Raw Headers:\n${request.rawHeaders}`,
          ht
        );

        // Send a 403 message in the appropriate manner
        response.status(403);
        if( request.accepts('html') ) {
          response.render( '403', { url: request.url } ).end();
          return;
        }
        if( request.accepts('json') ) {
          response.send( errorObject ).end();
          return;
        }
        response.type('txt').send( errorObject.asString() ).end();
      } );

      // Handle double dot file requests
      let doubledotfile = mount + '/..';
      app.get( doubledotfile, ( request, response ) => {

        let ht = new this._dep.HandlerTag(
          `Autoloader.mountStaticContent() (${doubledotfile})`,
          'string'
        ).getTag();

        let errorObject = new this._dep.Class.ServerError(
          'Forbidden',
          {},
          403
        );

        this._dep.Logger.log(
          `Forbidden: ${request.ip} requested ${request.path}\n` +
          `Raw Headers:\n${request.rawHeaders}`,
          ht
        );

        // Send a 403 message in the appropriate manner
        response.status(403);
        if( request.accepts('html') ) {
          response.render( '403', { url: request.url } ).end();
          return;
        }
        if( request.accepts('json') ) {
          response.send( errorObject ).end();
          return;
        }
        response.type('txt').send( errorObject.asString() ).end();
      } );
    } catch( exception ) {

      let msg = new this._dep.ServerError( 'Exception', {
        exception: exception
      } );
      this._dep.Logger.log(
        `Failed to mount ${mount}: ` +
        `${msg.eobj.exception.name}: ${msg.eobj.exception.message}`,
        ht
      );
      throw msg.asString();
    }
  }

  // @function			traverse()
  // @description		This function recursively traverses the directory structure
  //	              from the given directory point and invokes the appropriate
  //	              loading logic based off of the given config parameters.
  // @parameters		(object) app          The ExpressJS App/Router to mount all
  //	                                    child routes to.
  //	              (string) mount        The endpoint that this directory's
  //	                                    contents will be mapped to.         
  //	              (string) dir          The directory to search (i.e. the
  //	                                    current directory)
  // @returns				n/a
  traverse( app, mount, dir ) {

    let ht = new this._dep.HandlerTag(
      'Autoloader.traverse()',
      'string'
    ).getTag();

    try {

      // DEBUG
      this._dep.Logger.log( `Entering "${dir}"`, ht );

      // Get the current directory contents
      let dirContent = this._dep.fs.readdirSync( dir );
      
      // Check for any config file in the current directory
      let config = false;
      if( dirContent.includes( configFileName ) ) {
        
        // Load config file into memory and remove it from the directory content
        // load queue
        config = JSON.parse(
          this._dep.fs.readFileSync( `${dir}/${configFileName}` )
        );
        dirContent.splice( dirContent.indexOf( configFileName ), 1 );

        // Factor in any provided whitelist or blacklist
        if( config.include ) {
          dirContent = Object.keys( config.include );
        } else if ( config.exclude ) {
          Object.keys( config.exclude ).forEach( ( entityName ) => {
            if( dirContent.includes( entityName ) ) {
              dirContent.splice( dirContent.indexOf( entityName ), 1 );
            }
          } );
        }
      }

      // Traverse the directory contents recursively if needed
      dirContent.forEach( ( entityName ) => {

        // Factor in the entity alias if given
        let alias = false;
        if( config && config.alias && config.alias[entityName] ) {
          alias = this._dep.Util.trimSlashes( config.alias[entityName] );
          
          // // DEBUG
          // this._dep.Logger.log( `Using alias "${alias}"`);
        }

        // Handle trailing and leading forward-slashes in paths strings
        dir = this._dep.Util.trimTrailingSlash( dir );
        mount = this._dep.Util.trimTrailingSlash( mount );
        entityName = this._dep.Util.trimSlashes( entityName );

        // Get information about the entity
        let entityPath = `${dir}/${entityName}`;
        let entityMount = `${mount}/${alias !== false ? alias : entityName}`;
        let entityInfo = this._dep.fs.lstatSync( entityPath );

        // Check if this entity is mapped to a middleware controller
        if( config && config.apps && config.apps[entityName] ) {

          // TODO: Mount the entity as an middleware-controlled endpoint and
          // stop all further processing for it.
          
        } else {

          // Check if this entity is a directory
          if( !entityInfo.isSymbolicLink() && entityInfo.isDirectory() ){

            // If a directory was found, mount it recursively
            this.traverse( app, entityMount, entityPath );
          }

          // After traversing recursively, check if the entity is a permitted
          // file before mounting it
          if( entityInfo.isFile() && !['.', '..'].includes( entityName ) ) {

            // Mount static file here
            this.mountStaticContent( app, entityMount, entityPath );
          }
        }
      } );
    } catch( exception ) {

      let msg = new this._dep.ServerError( 'Exception', {
        exception: exception
      } );
      this._dep.Logger.log(
        `Failed to traverse ${dir}: ` +
        `${msg.eobj.exception.name}: ${msg.eobj.exception.message}`,
        ht
      );
      throw msg.asString();
    }
  }
}
// END class Autoloader

module.exports = Autoloader;
// END autoloader.js
