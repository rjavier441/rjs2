//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					static_autoloader.js
//	@Date Created:	2020-01-05
//	@Last Modified:	2020-01-05
//	@Details:
//									This file defines a utility class that handles static asset
//	                routing for a given directory/app.
//	@Dependencies:
//									n/a
//  @Notes:
//	                This module is intended for use within an individual sub-
//	                app. Plans are being made in the near future to automate
//	                and further modularize the creation of sub-application
//	                endpoints in a per-directory basis, which will hopefully
//	                eliminate the need to autoload everything from the server
//	                root and instead enable it recursively throughout each
//	                directory and its sub-directories.

'use strict';

// Includes
const settings = require( './settings.js' );
const DependencyInjectee = require( `${settings.util}/class/dependencyInjectee.js` );
const fs = require( 'fs' );
const HandlerTag = require( `${settings.util}/class/handlerTag.js` );
const logger = require( `${settings.util}/logger` );
const ServerError = require( `${settings.util}/class/serverError.js` );
const ServerResponse = require( `${settings.util}/class/serverResponse.js` );

// BEGIN Static Autoloader Config Documentation
// @config				autoloader_static.json
// @description		A file that allows the user to control which static resources
//								and/or files will be routed via a static route. Useful for
//								file and directory access control from the public, this
//								configuration file allows the user to specify a whitelist or
//								blacklist to control static resource routing. If both are,
//								provided, the whitelist will take precedence.
//
//								In order to enable this feature, this file must be present
//								within each endpoint directory. An endpoint directory is
//								defined as any subdirectory within either:
//
//									a.) the custom server route directory "routes" given to
//											autoloader.route.load(), or
//									b.) the server root directory if "routes" was not given.
//
//								For example, assuming the server root "/rjs2/public" was the
//								given "routes" directory containing all applications under
//								the "/rjs2/public/app1" and "/rjs2/public/app2" directories,
//								control for each application's static resource routing can be
//								acheived by placing an autoloader_static.json in those
//								directories.
// @parameters		(~string[]) include		A whitelist of paths within the
//																			application directory that should be
//																			routed as a static resource accessible
//																			to the public. If provided alongside
//																			the "exclude" (blacklist), "exclude" is
//																			ignored in favor of the "include"
//																			whitelist.
//								(~string[]) exclude		A blacklist of paths within the
//																			application directory that shouldn't be
//																			routed as a static resource accessible
//																			to the public. If provided alongside
//																			the "include" (whitelist), this
//																			parameter is ignored in favor of the
//																			"include" whitelist
// @note					Each path in either "include" or "exclude" lists must be done
//								in reference to the app directory, without a leading forward-
//								slash (i.e. "/" is not the first character in the path)
// @example
//								Given the following directory structure:
//
//									+ /public
//									|---- /app1
//									|			|---- index.html
//									|
//									|---- /app2
//												|---- index.html
//												|---- /dir1
//												|			|----index.js
//												|			|----index.css
//												|
//												|---- /dir2
//															|----img.jpg
//
//								Assume the goal was to create static routes for all files
//								under "/app1", but only index.js under "/app2". To do this,
//								we must make config files for each app directory.
//
//								========
//								"/app1":
//								========
//								To include all contents under "/app1", you can do one of two
//								things:
//
//									1.) Leave the directory without a config file, and the
//											route autoloader will assume all files should be
//											statically routed, or
//									2.) Create "/public/app1/autoloader_static.json" and give
//											it the following content:
//
//												{
//													include: [ 'index.html' ]
//												}
//
//								========
//								"/app2":
//								========
//								To include only "/public/app2/dir1/index.js", you can do one
//								of two things:
//
//									1.) Create "/public/app2/autoloader_static.json" and give
//											it a whitelist:
//
//												{
//													include: [ 'dir1/index.js' ]
//												}
//									2.) Create "/public/app2/autoloader_static.json" and give
//											it a blacklist:
//
//												{
//													exclude: [
//														'index.html',
//														'dir1/index.css',
//														'dir2/img.jpg'
//													]
//												}
// END Static Autoloader Config Documentation

// BEGIN class StaticAutoLoader
class StaticAutoLoader extends DependencyInjectee {
  
  // @ctor
  // @parameters		n/a
  constructor( deps ) {
    super( deps );
  }

  // @function			load()
  // @description		This function loads static resources to endpoints. It is
  //	              intended for use within sub-app index routers (e.g. within
  //	              an application's "app/routes/index.js", the app's router
  //	              file).
  // @parameters		(object) router				The ExpressJS router to map static
  //																			assets to. This type of object is
  //																			returned from a call to the
  //	                                    express.Router() function.
  //	              (string) endpoint     The name of the server route endpoint
  //	                                    to associate with the given directory
  //	                                    and its resources.
  //	              (string) root         The sub-application's root directory.
  //	                                    For example, if the server's root is
  //	                                    "/rjs2/public", and it conatined the
  //	                                    app "/app1", loading of routes for
  //	                                    app "app1" would require this
  //	                                    argument's value to be "/rjs2/public/
  //	                                    app1".
  // @returns				n/a
  static load( router, endpoint, root ) {
  
    let ht = new HandlerTag( 'StaticAutoLoader.load', 'string' ).getTag();
    let acl = false;
    let staticConfigFilename = 'autoloader_static.json';

    try {

      // Check for any restrictions on static asset routing
      if( fs.readdirSync( root ).includes( staticConfigFilename ) ) {
  
        logger.log( `Routing specific static content under ${root} to endpoint ${endpoint}`, ht );
        acl = JSON.parse( fs.readFileSync( `${root}/${staticConfigFilename}` ) );
      } else {
  
        logger.log(
          `Routing all static content under ${root} to endpoint ${endpoint}`,
          ht
        );
      }
  
      // Recursively go through each directory to map each file individually
      StaticAutoLoader.recursivelyLinkStatic( router, endpoint, root, acl );
    } catch( exception ) {

      var msg = new ServerError( 'Exception', {
        exception: exception
      } );
      logger.log(
        `Static resource link failed for path "${root}" to endpoint ` +
        `"${endpoint}": ${msg.eobj.exception.name}: ` +
        `${msg.eobj.exception.message}`,
        ht
      );
      throw msg.asString();
    }
  };

  // @function			recursivelyLinkStatic()
  // @description		This function recursively traverses the directory structure
  //								from the given directory point and routes all files that do
  //	              not conflict with the access control list as static
  //								resources.
  // @parameters		(object) router				The ExpressJS router to map static
  //																			assets to. This type of object is
  //																			returned from a call to the
  //	                                    express.Router() function.
  //								(string) mount				The mount path to map all static
  //																			files to.
  //								(string) dir					The directory to search.
  //								(~object[]) acl				An optional instance of the static
  //																			resource routing control
  //	                                    configuration file
  //	                                    "autoloader_static.json" (see the
  //																			above config documentation for more
  //																			details). If omitted, this defaults
  //																			to false.
  // @returns				n/a
  static recursivelyLinkStatic(
    router,
    mount,
    dir,
    acl = false
  ) {

    let ht = new HandlerTag(
      'StaticAutoLoader.recursivelyLinkStatic',
      'string'
    ).getTag();

    // Trim mount and dir of trailing forward-slashes
    if( mount[ mount.length - 1 ] === '/' ) {
      mount = mount.substring( 0, mount.length - 1 );
    }
    if( dir[ dir.length - 1 ] === '/' ) {
      dir = dir.substring( 0, dir.length - 1 );
    }

    // Read directory contents
    fs.readdirSync( dir ).forEach( ( entityName ) => {

      // Get information about the entityName
      let entityPath = `${dir}/${entityName}`;
      let entityMountPath = `${mount}/${entityName}`;
      let entityInfo = fs.lstatSync( entityPath );

      // Check if this is a directory
      if( !entityInfo.isSymbolicLink() && entityInfo.isDirectory() ) {

        // Recursively link items under this directory
        StaticAutoLoader.recursivelyLinkStatic(
          router,
          entityMountPath,
          entityPath,
          acl
        );
      }

      // Only mount this entity if it is a file (a leaf in the FS tree), and
      // if it's not a dot-file (directory navigator file)
      if( entityInfo.isFile() && !['.', '..'].includes(entityName) ) {

        // // DEBUG
        // logger.log( `\nTEST:\nEntity: ${entityName}\nMount: ${mount}\nDir: ${dir}`, ht );
        
        // TODO: Cross-reference the entity with a whitelist/blacklist if given one
        let okToMap = true;
        if( acl ) {
          
          // Entity the acl entity path in a form comparable to the entity path
          let aclEntityKey = `${mount}/${entityName}`;
          // let aclRelativePath = dir.substring( settings.root.length );
          // let aclEntityKey = `${aclRelativePath}/${entityName}`;
          if( aclEntityKey[0] === '/' ) {
            aclEntityKey = aclEntityKey.substring( 1 );
          }
          
          // O(n^2), since it checks the whole list each time
          if( typeof acl.include !== 'undefined' ) {

            okToMap = acl.include.includes( aclEntityKey );
          } else if( typeof acl.exclude !== 'undefined' ) {

            okToMap = !acl.exclude.includes( aclEntityKey );
          }
          
          // // DEBUG
          // let debugmsg;
          // debugmsg += `\nACL: ${ JSON.stringify( acl ) }`;
          // debugmsg += `\nACL Entity: ${aclEntityKey}`;
          // debugmsg += `\nEntity Mount: ${entityMountPath}`;
          // debugmsg += `\n\nTEST:\nEntity: ${entityName}`;
          // debugmsg += `\nMount: ${mount} (${mount.length} chars)`;
          // debugmsg += `\nDir: ${dir}`;
          // debugmsg += `\n\nOk To Map: ${okToMap ? 'true' : 'false'}`;
          // logger.log( debugmsg, ht );
        }


        // Mount the static asset to the specified mount path
        if( okToMap ) {
          
          logger.log( `Mounting "${entityPath}" to "${entityMountPath}"`, ht );

          // TEST
          StaticAutoLoader.mount( router, entityMountPath, entityPath );
        }
      }
    } );
  }

  // @function			mount()
  // @description		This function mounts the specified file to the specified
  //	              endpoint.
  // @parameters		(object) router			The ExpressJS router to map static
  //																		assets to. This type of object is
  //																		returned from a call to the
  //	                                  express.Router() function.
  //	              (string) mount      The path to mount the file to.
  //	              (string) file       The path to the file.
  // @returns				n/a
  static mount( router, mount, file ) {

    router.get( mount, function( request, response ) {
      
      let ht = new HandlerTag(
        `StaticAutoLoader.mount (${request.path})`,
        'string'
      ).getTag();

      // Resolve root (set to server root, since we use absolute paths for
      // our path resolution in this class)
      let rootOfThisRequest = '/';

      // Send file
      // response.set( 'Content-Type', '?' );	// Content Type is automatic
      response.sendFile(
        file,
        {
          root: rootOfThisRequest,
          dotfiles: 'deny',
          headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
          }
        },
        ( error ) => {
          if( error ) {

            let errorPacket = new ServerError( error );
            logger.log(
              `Failed to send ${file} to client @ ip ` +
              `${request.ip}: ${errorPacket.asString()}`,
              ht
            );
          } else {
            
            logger.log(
              `Sent ${file} to client @ ip ${request.ip}`,
              ht
            );
            response.status(200).end();
          }
        }
      );
    } );
  }
}
// END class StaticAutoLoader

module.exports = StaticAutoLoader;

// END static_autoloader.js
