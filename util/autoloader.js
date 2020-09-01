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
const CsrfUtil = require( './csrfUtil.js' );
const { response } = require('express');

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
//                (~object) mountConfig An object describing actions to run
//                                      at different stages of an endpoint
//                                      mount. This is useful for specifying
//                                      certain actions or preprocessing of
//                                      files, routes and static content.
//                                      Follows the following format:
// 
//                                        "mountConfig": {
//                                          "fileToPerformActionsOn": {
//	                                          
//	                                          // Stages:
//                                            "pre": [ ... ],
//                                            "req": [ ... ],
//                                            ...
//                                          }
//                                        }
//                                      Possible stages (i.e. valid keys)
//                                      include:
//                  (~array) pre          Actions that must be performed
//                                        before mounting. Valid actions
//                                        include:
//                                          "csrfProtection":
//	                                          Pushes CsrfUtil::getInstance.
//                                          "ejsLoadCsrfToken":
//	                                          Pushes logic that pulls a
//                                            CSRF token from the loaded
//                                            CsrfUtil instance (requires
//                                            "csrfProtection" action first)
//                                            and saves it in a local var
//                                            storage for use with other
//                                            EJS pre/req pipeline stages.
//                  (~array) req          Actions that should be performed
//                                        by the mount handler callback,
//	                                      which is triggered when a static
//                                        resource request is made for the
//                                        associated static content (i.e. a
//                                        GET request for the routed item).
//                                        Valid actions include:
//                                          "ejsRenderAndSendTemplate":
//                                            Uses EJS to render the entity
//                                            being mounted, utilizing any
//                                            ejs loaded variables in its
//                                            generation. Then, sends the
//                                            rendered HTML to the client
//                                            with a code 200. Does NOT end
//                                            the request; use "terminate"
//                                            to end the request.
//                                          "terminate":
//                                            Ends the request by calling
//                                            Express::Response::end(). Any
//                                            actions listed after this are
//                                            skipped.
//                  *Coming Soon:*
//                  ~~~(~object) post        Actions to be performed after
//                                        mounting.~~~
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
  // @parameters		(object) deps         An object containing dependencies
  //	                                    injected by the caller. The following
  //	                                    dependencies are required:
  // @dependencies
  //                ejs = require( 'ejs' );
  //                fs = require( 'fs' );
  //                path = require( 'path' );
  //                HandlerTag = require( `${settings.util}/class/handlerTag.js` );
  //                Logger = require( `${settings.util}/logger.js` );
  //                ServerError = require(
  //                  `${settings.util}/class/serverError.js`
  //                );
  //                ServerResponse = require(
  //	                `${settings.util}/class/serverResponse.js`
  //	              );
  //                Util = require( `${settings.util}/util.js` );
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

      // Traverse rjs2 filesystem recursively to map routes
      this.traverse( app, '/', root );
      
      // Mount miscellaneous/general endpoints
      this.mountCsrfError( app );
      this.mountNotFound( app );
    } catch( exception ) {
      
      // DEBUG
      // throw exception;
      // console.log( 'loadFromRoot() exception:', exception );
      // console.log( __line.toString().split( ',' ) );

      let msg = new this._dep.ServerError( `{"Exception (${ht.src})": ${JSON.stringify(exception.message)}}`, {
        exception: exception
      } );
      this._dep.Logger.log(
        `Failed to load root from ${root}: ` +
        `${exception.name}: ${exception.message}`,
        ht
      );
      throw msg; // mark
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
      
      // DEBUG
      // console.error( 'exception:', exception.message );

      let emsg = `Failed to mount ${mount}: ${exception.name}: ` +
        `${exception.message}`;
      let msg = new this._dep.ServerError(
        `{"Exception (${ht.src})": ${JSON.stringify(exception.message)},` +
        `"emsg": ${emsg}}`,
        { exception: exception }
      );
      this._dep.Logger.log( emsg, ht );
      throw msg; // mark
    }
  }

  // @function			mountNotFound()
  // @description		This function adds a general purpose "404" Endpoint if all
  //	              other routes fail.
  // @parameters		(object) app          The ExpressJS app/router to map
  //                                      the given asset to. This type of
  //                                      object is typically returned from
  //                                      a call to "express()" or "express.
  //                                      Router()".
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
            new this._dep.ServerError( 'Not Found', {}, 404 )
          ).end();
          return;
        }

        response.type('txt').send(
          ( new this._dep.ServerError( 'Not Found', {}, 404 ) ).asString()
        ).end();
      } );
    } catch( exception ) {
      
      let msg = new this._dep.ServerError( `{"Exception (${ht.src})": ${JSON.stringify(exception.message)}}`, {
        exception: exception
      } );
      this._dep.Logger.log(
        `Failed to mount "Not Found" general endpoint: ` +
        `${exception.name}: ${exception.message}`,
        ht
      );
      throw msg; // mark
    }
  }

  // @function			mountCsrfError()
  // @description		Adds a general purpose error handler to run if a csurf
  //                error occurs.
  // @parameters		(object) app          The ExpressJS app/router to map
  //                                      the given asset to. This type of
  //                                      object is typically returned from
  //                                      a call to "express()" or "express.
  //                                      Router()".
  // @returns				n/a
  mountCsrfError( app ) {

    let ht = new this._dep.HandlerTag(
      'Autoloader.mountCsrfError()',
      'string'
    ).getTag();

    try {

      // DEBUG
      this._dep.Logger.log( `Mounting general Csrf Error endpoint`, ht );

      app.use( ( error, request, response, next ) => {

        // Only handle if its a CSRF token validation error
        if( error.code !== 'EBADCSRFTOKEN' ) {
          return next(error);
        }

        // Send a 403 code to the client that made this request (which is
        // likely someone who doesn't have the correct CSRF token)
        this._dep.Logger.log( `CSRF error: ${error.message}`, ht );
        response.status( 403 );
        let serverErrorObj = new this._dep.ServerError(
          'Forbidden', {}, 403
        );
        if( request.accepts( 'html' ) ) {
          
          // Generate and send error as HTML to client
          let payload = this._dep.TemplateManager.generate(
            'error',
            {
              errorCode: 403,
              errorTitle: 'Forbidden',
              errorMessage: 'You are not permitted to perform this action'
            }
          );
          response.send( payload ).end();
        } else if( request.accepts('json') ) {

          // Send error as JSON
          response.send( serverErrorObj ).end();
        } else {

          // Send error as text
          response.type( 'txt' ).send(
            serverErrorObj.asString()
          ).end();
        }
      } );
    } catch( exception ) {

      let msg = new this._dep.ServerError( `{"Exception (${ht.src})": ${JSON.stringify(exception.message)}}`, {
        exception: exception
      } );
      this._dep.Logger.log(
        `Failed to mount "Csrf Error" general endpoint: ` +
        `${exception.name}: ${exception.message}`,
        ht
      );
      throw msg; // mark
    }
  }

  // @function			preActionFactory()
  // @description		A factory function that builds the processing pipeline
  //                of functions for static content that is assigned "pre"
  //                actions
  // @parameters		(string) mount        The mount path of the entity being
  //                                      mounted.
  //                (string) path         The path of the entity being
  //                                      mounted.
  //                (array) actions       The array of "pre" actions to
  //                                      perform. See the documentation
  //                                      above for a list of supported
  //                                      action ids.
  // @returns				(function[]) pipeline The "pre" processing pipeline
  //                                      to use for this load.
  preActionFactory( mount, path, actions ) {
    let rafHt = new this._dep.HandlerTag(
      'Autoloader.preActionFactory()', 'string'
    ).getTag();
    let pipeline = [];

    this._dep.Logger.log(
      `Building pre action pipeline for "${mount}" (${path})`, rafHt
    );
    actions.forEach( actionId => {
      switch( actionId ) {

        // Apply CSRF Token Checks (only effective in non-GET requests)
        case 'csrfProtection':{
          pipeline.push( CsrfUtil.getInstance() );
          break;
        }
        
        // Inject the CSRF token to the request object's locals for
        // ejs data
        case 'ejsLoadCsrfToken': {
          pipeline.push( ( req, res, next ) => {
            if( !req.locals ) { req.locals = {}; }
            if( !req.locals.ejs ) { req.locals.ejs = {}; }
            req.locals.ejs.csrfToken = req.csrfToken();
            next();
          } );
          break;
        }
      }
    } );

    return pipeline;
  }

  // @function			reqActionFactory()
  // @description		A factory function that builds the processing pipeline
  //                of functions for static content that is assigned "req"
  //                actions. These actions REPLACE the default behavior of
  //                the primary mount handler, which typically sends static
  //                files based on absolute path.
  // @parameters		(string) mount        The mount path of the entity being
  //                                      mounted.
  //                (string) path         The path of the entity being
  //                                      mounted.
  //                (array) actions       The array of "req" actions to
  //                                      perform instead of the default
  //                                      mount handler. See documentation
  //                                      above for a list of supported
  //                                      action ids.
  // @returns				(function[]) pipeline The "req" processing pipeline to
  //                                      use for this load.
  reqActionFactory( mount, path, actions ) {
    let rafHt = new this._dep.HandlerTag(
      'Autoloader.reqActionFactory()', 'string'
    ).getTag();
    let pipeline = [];

    this._dep.Logger.log(
      `Building req action pipeline for "${mount}" (${path})`, rafHt
    );
    let endProcessing = false;
    actions.forEach( ( actionId, index ) => {
      if( endProcessing ) return;
      switch( actionId ) {

        // Overrides default with EJS html template rendering (and uses
        // any data from req.locals.ejs that was defined in the earlier
        // stages)
        case 'ejsRenderAndSendTemplate': {
          pipeline.push( ( req, res, next ) => {

            let ht = new this._dep.HandlerTag(
              `Autoloader.ejsRenderAndSendTemplate() (${mount})`, 'string'
            ).getTag();
            
            try {
              
              // Render template
              this._dep.Logger.log(
                `Rendering EJS template "${path}"`, ht
              );
              let data = req.locals.ejs ? req.locals.ejs : undefined;
              let content = this._dep.fs.readFileSync( path, 'utf-8' );
              let output = this._dep.ejs.render( content, data );
              
              // Send to client and go to next pipeline function
              res.type( 'html' );
              res.set( 'x-timestamp', Date.now() );
              res.set( 'x-sent', true );
              res.status( 200 ).send( Buffer.from( output ) );
              next();
            } catch( exception ) {
              this._dep.Logger.log( new this._dep.ServerError(
                exception.toString()
              ), ht );
              next();
            }
          } );
          break;
        }

        // Terminates the request chain by ending the response
        case 'terminate': {
          pipeline.push( ( req, res, next ) => {
            res.end();
          } );
          endProcessing = true; // skips any items after "terminate" cmd
          break;
        }
      }
    } );

    return pipeline;
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
  //                (~object) actions     A set of actions to perform at
  //                                      different stages of the mounting
  //                                      of this static content. See the
  //                                      documentation above for more
  //                                      details.
  //                                      
  // @returns				n/a
  mountStaticContent( app, mount, file, actions = false ) {

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

      // Configure content handlers
      let handlerFunctions = [];

      // Define pre-mount handlers (if any is requested)
      if( actions && actions.pre ) {
        
        // Run preprocessing pipeline builder
        handlerFunctions = handlerFunctions.concat(
          this.preActionFactory( mount, file, actions.pre )
        );
      }

      // Define the request mount handler
      if( actions && actions.req ) {

        // If specified, override the default with specific handlers
        handlerFunctions = handlerFunctions.concat(
          this.reqActionFactory( mount, file, actions.req )
        );

        // DEBUG
        // this._dep.Logger.log( handlerFunctions, ht );
        setTimeout( () => {
          app._router.stack.forEach( item => {
            if( item.route && item.route.path.includes('index.ejs' ) ) {
              console.log( item );
            }
          } );
        }, 2500 );
      } else {

        // Use the default primary request mount handler
        handlerFunctions.push( ( request, response ) => {
  
          let ht = new this._dep.HandlerTag(
            `Autoloader.mountStaticContent() (${mount})`,
            'string'
          ).getTag();
  
          // TODO: 2020-08-30: Change this logic to do view rendering when
          // it finds index.html; This should allow us to inject CSRF token
          // into the meta tag
    
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
  
                // DEBUG
                console.log( 'ERROR:\n', error );
                console.log( 'File:', file );
    
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
      }

      // Mount static content with a GET
      app.get( mount, ...handlerFunctions );

      // Handle dot file requests
      let dotfile = mount + '/.';
      app.get( dotfile, ( request, response ) => {

        let ht = new this._dep.HandlerTag(
          `Autoloader.mountStaticContent() (${dotfile})`,
          'string'
        ).getTag();

        let errorObject = new this._dep.ServerError(
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

        let errorObject = new this._dep.ServerError(
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

      let msg = new this._dep.ServerError( `{"Exception (${ht.src})": ${JSON.stringify(exception.message)}}`, {
        exception: exception
      } );
      this._dep.Logger.log(
        `Failed to mount ${mount}: ` +
        `${exception.name}: ${exception.message}`,
        ht
      );
      throw msg; // mark
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

        // Check for any pre-mounting actions that need to be taken for a
        // specific file.
        let entityMountConfig = false;
        if( config && config.mountConfig && config.mountConfig[entityName] ) {
          entityMountConfig = config.mountConfig[entityName];
        }

        // Check if this entity is mapped to a middleware controller
        if( config && config.apps && config.apps[entityName] ) {

          // TODO: Mount the entity as a middleware-controlled endpoint and stop
          // all further processing for it.
          this.mountMiddleware(
            app,
            entityMount,
            `${dir}/${config.apps[entityName]}`
          );
        } else {

          // Check if this entity is a directory
          if( !entityInfo.isSymbolicLink() && entityInfo.isDirectory() ){

            // If a directory was found, mount it recursively
            this.traverse( app, entityMount, entityPath );
          }

          // After traversing recursively, check if the entity is a permitted
          // file before mounting it
          if( entityInfo.isFile() && !['.', '..'].includes( entityName ) ) {

            // Windows Compatibility: Remove leading "C:/"
            if( this._dep.Util.getPlatform() === 'Windows' ) {
              entityPath = entityPath.substr(3);
            }

            // Mount static file here
            this.mountStaticContent(
              app, entityMount, entityPath, entityMountConfig
            );
          }
        }
      } );
    } catch( exception ) {

      let msg = new this._dep.ServerError( `{"Exception (${ht.src})": ${JSON.stringify(exception.message)}}`, {
        exception: exception
      } );
      this._dep.Logger.log(
        `Failed to traverse ${dir}: ` +
        `${exception.name}: ${exception.message}`,
        ht
      );

      // // DEBUG
      // console.error( 'traverse() exception:', msg );

      throw msg; // mark
    }
  }
}
// END class Autoloader

module.exports = Autoloader;
// END autoloader.js
