# rjs2 User Guide: Creating Web Content

An in-depth guide illustrating how to create web content in rjs2.

Current Version: v0.0.4 (Alpha)

Last Updated: 2020-02-01

---

## **Table of Contents**

- [Directory Structure](#directory-structure)
- [Web Content In General](#web-content-in-general)
- [Server-Side Content Routing](#server-side-content-routing)
    - [Routing Process](#routing-process)
    - [Configure Routing Behavior](#configure-routing-behavior)
- [Client-Side Content Referencing](#client-side-content-referencing)
- [Using Middleware as APIs](#using-middleware-as-apis)
    - [Routing Middleware](#routing-middleware)
- [Creating Middleware](#creating-middleware)
    - [Basic Structure](#basic-structure)
    - [Creating API Endpoints](#creating-api-endpoints)

---

## **Directory Structure**

```
rjs2/
+-  public/
|   +-  someContent/
|       +-  somePage.html
|       +-  js/
|       |   +-  someJavascriptFile.js
|       +-  css/
|       |   +-  someCssFile.css
|       +-  someDir/
|           +-  ...
|       
+-  ...
```

---

## **Web Content in General**

In general, web content in rjs2 refers to files that are publicly shared with the web. In fact, the very nature of the web server involves sharing files publicly. Whether serving static files or hosting elaborate web applications, both these types of items fall under the category of web content.

---

## **Server-Side Content Routing**

The term _**routing**_ in rjs2 refers to the mounting of web content under a (more or less) fixed URI endpoint. More precisely, "routing" is the process that rjs2 undergoes to map URI endpoints to publicly exposed files. Take the following example directory structure:

```
rjs2/
+-  public/
|   +-  someContent/
|       +-  ...
+-  someOtherDir/
|   +- ...
+-  ...
```

The contents of `someOtherDir/` are not considered publicly exposed web content (and are therefore not served to the internet) because they are not within the server root `public/`. Routing will only take place for files under the server root.

The rjs2 server routes web content under the following circumstances:

- The server root (a.k.a. the `public/` directory by default) is used to house publicly exposed web content
    > That is, URI generation begins at the server root and recursively traverses the directory tree to generate URIs. The only exceptions are links; rjs2 does not follow links of any kind when generating web content URIs. _**Plans to enable this behavior are under consideration.**_
- Currently, web content is routed _ONLY_ at server startup
    > Specifically, URI endpoints are only generated when you start the server. This implies that any changes to the publicly exposed file structure are not registered after startup. To register any changes (i.e. renaming/repositioning of directories and files), a server restart is required. _**Plans to improve this behavior are under development**_.
- Web content routing behavior can optionally be configured by the user
    > Customized routing behavior is configurable in a per-directory basis. See the [next section](#configure-routing-behavior) for more details.

## Routing Process

The rjs2 server starts its routing by entering the server root (defaults to `rjs2/public`) and recursively traverses each directory unless configured to do otherwise.

The rjs2 web content routing process follows the following behavior:

1. Scan current directory contents
1. If current directory has a routing configuration file `_alconfig.json`, use this file to determine how to route the web contents in this directory
1. Otherwise, recursively apply the routing process (i.e. repeat all steps) for other directories found within the current one
1. Once all directories within the current one have been traversed, generate URI endpoints for each file in this directory

By default, URI endpoints will serve files after receiving "GET" requests, and will mirror each file's path with respect to the server root. For example:

```
rjs2/
+-  public/
|   +-  dir/
|       +-  somePage.html // Content A
|       +-  js/
|           +-  file.js   // Content B
|       +-  css/
|           +-  file.css  // Content C
+-  ...
```

Assuming the server has the above file structure the url `www.rjs2.com`, each web content item will be routed as follows:

```
+-----------------------------------+-------------------------------------+
| Actual Path                       | URI (used to "GET" the file)        |
|-----------------------------------|-------------------------------------|
| rjs2/public/dir/somePage.html     | www.rjs2.com/dir/somePage.html      |
|-----------------------------------|-------------------------------------|
| rjs2/public/dir/js/file.js        | www.rjs2.com/dir/js/file.js         |
|-----------------------------------|-------------------------------------|
| rjs2/public/dir/css/file.css      | www.rjs2.com/dir/css/file.css       |
+-----------------------------------+-------------------------------------+
```

## Configure Routing Behavior

Configuring custom routing behavior is done on a per-directory basis as illustrated above, meaning each directory is checked for custom configurations to apply for itself. Configurations are stored in an optional `_alconfig.json` routing configuration file, which must be placed in the directory for which it will be applied. Routing configuration files may take the following form:

```javascript
{
  "option1": ...,
  ...
  "optionN": ...
}
```

The following options are supported:

- `alias`
    - A map of aliases, where keys represent the names of files and directories within the current directory, and values are the aliases to these files and directories. If omitted, no aliases will be used, and endpoint routing will use the actual names of the files and directories.
- `include`
    - A map serving as a whitelist of file and/or directory names within the current directory. Keys represent the names of items to include. If provided alongside the "exclude" parameter, "exclude" is ignored.
- `exclude`
    - A map serving as a blacklist of file and/or directory names within the current directory. Keys represent the names of items to exclude. If provided alongside the "include" parameter, this parameter is ignored.
- `apps`
    - A map of directory names to paths of app/router middleware files (relative to the current directory) that will handle all endpoints under the corresponding directory name. This is the _**primary**_ way to create **APIs**. If this argument is omitted, content is treated as static web content and exposed to the public based on the provided alias, include and exclude parameters. If this argument is given, the specified app/router middleware file will be routed to the current endpoint, and no further depth-first traversal will occur for the current directory. Instead, control of deeper routing is fully transferred to the linked app/router middleware file. For more information on how to create APIs using this mechanism, see the [Using Middleware as APIs](#using-middleware-as-apis) section.

To illustrate its usage, consider the following example. Suppose your server is mapped to the url `www.rjs2.com` and has the following directory structure:

```
rjs2/
+-  public/
|   +-  dir/
|   |   +-  homepage.html
|   |   +-  js/
|   |   |   +-  file.js
|   |   +-  css/
|   |   |   +-  file.css
|   |   +-  private/
|   |       +-  file.txt
|   +-  dir2/
|       +-  page1.html
|       +-  page2.html
+-  ...
```

By default, the contents of `dir/` would be mapped to the following URIs:

```
+-----------------------------------+-------------------------------------+
| Actual Path                       | URI (used to "GET" the file)        |
|-----------------------------------|-------------------------------------|
| rjs2/public/dir/homepage.html     | www.rjs2.com/dir/homepage.html      |
|-----------------------------------|-------------------------------------|
| rjs2/public/dir/js/file.js        | www.rjs2.com/dir/js/file.js         |
|-----------------------------------|-------------------------------------|
| rjs2/public/dir/css/file.css      | www.rjs2.com/dir/css/file.css       |
|-----------------------------------|-------------------------------------|
| rjs/public/dir/private/file.txt   | www.rjs2.com/dir/private/file.txt   |
|-----------------------------------|-------------------------------------|
| rjs/public/dir2/page1.html        | www.rjs2.com/dir2/page1.html        |
|-----------------------------------|-------------------------------------|
| rjs/public/dir2/page2.html        | www.rjs2.com/dir2/page2.html        |
+-----------------------------------+-------------------------------------+
```

Assume you have the following objectives:

1. Expose the contents of `dir2/` under the endpoint alias `content/`
1. Make it more convenient to access the homepage (i.e. mount `homepage.html` to the `www.rjs2.com/dir` endpoint directly, which is much simpler than requesting it explicitly through `www.rjs2.com/dir/homepage.html`)
1. Prevent the contents of `rjs2/public/dir/private/` from being exposed to the internet

Each objective can be acheived by using various routing configuration files as described below (respectively):

1. Exposing content under an endpoint that differs from the content's parent directory name requires a routing configuration file to specify an alias. Since routing for the `dir2/` directory takes place in `public/`, the routing configuration file must be placed in `public/`. Create the file `rjs2/public/_alconfig.json` and insert the following:

    ```javascript
    {
        "alias": {
            "dir2": "content"
        }
    }
    ```

1. This objective is equivalent to routing the `homepage.html` file to the `/` endpoint with respect to `dir/`. Therefore, routing must be done via an alias under the `dir/` directory. Create the file `rjs2/public/dir/_alconfig.json` and insert the following:

    ```javascript
    {
        "alias": {
            "homepage.html": "/"
        }
    }
    ```

1. This objective is equivalent to excluding the entire `private/` directory from the routing process. Since routing for `private/` takes place in `dir/`, a routing configuration file is required in `dir/`. We already created `rjs/public/dir/_alconfig.json` to satisfy the previous objective, so we can simply add to it in order to exclude `private/`. Adding an exclusion for `private/` results in the following content within `rjs/public/dir/_alconfig.json`:

    ```javascript
    {
        "alias": {                  // <--- From Objective 2 
            "homepage.html": "/"
        },
        "exclude": {
            "private": false        // <--- You can set the value to anything
        }
    }
    ```

---

## **Client-Side Content Referencing**

Referencing content that is routed from the backend is straightforward. All requests are done with respect to the server's url and any aliases done to the endpoint. Therefore, full paths starting from the server's base endpoint must be given. Consider the following examples.

## Example 1: Referencing Unaliased Content

assume your server routed content to the following URIs:

```
+-----------------------------------+-------------------------------------+
| Actual Path                       | URI (used to "GET" the file)        |
|-----------------------------------|-------------------------------------|
| rjs2/public/dir/homepage.html     | www.rjs2.com/dir/homepage.html      |
|-----------------------------------|-------------------------------------|
| rjs2/public/dir/js/file.js        | www.rjs2.com/dir/js/file.js         |
|-----------------------------------|-------------------------------------|
| rjs2/public/dir/css/file.css      | www.rjs2.com/dir/css/file.css       |
+-----------------------------------+-------------------------------------+
```

Also assume that `homepage.html` has the following content:

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/file.css">
</head>
<body> ... </body>
<footer>
    <script src="js/file.js"></script>
</footer>
</html>
```

When the above page loads, it will **FAIL** to "GET" `file.css` and `file.js` because the above `href` and `src` attributes do not contain full paths with respect to the server's url. More precisely, the homepage was requested from `dir/` without an alias, so all its content must also be requested from the `dir/` endpoint. To resolve this, replace the link and script inclusion lines with their respective corrections:

```html
<link rel="stylesheet", href="dir/css/file.css">
<script src="dir/js/file.js"></script>
```

## Example 2: Referencing Aliased Content

As another example, assume your server served the content of the directory `dir/` under the `/` alias:

```
+-----------------------------------+-------------------------------------+
| Actual Path                       | URI (used to "GET" the file)        |
|-----------------------------------|-------------------------------------|
| rjs2/public/dir/homepage2.html    | www.rjs2.com/homepage2.html         |
|-----------------------------------|-------------------------------------|
| rjs2/public/dir/js/file.js        | www.rjs2.com/js/file.js             |
|-----------------------------------|-------------------------------------|
| rjs2/public/dir/css/file.css      | www.rjs2.com/css/file.css           |
+-----------------------------------+-------------------------------------+
```

Assume that `homepage2.html` also has the following content:

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/file.css">
</head>
<body> ... </body>
<footer>
    <script src="js/file.js"></script>
</footer>
</html>
```

When the above page loads, it will actually **SUCCEED** in "GET"-ting `file.css` and `file.js` because their respective paths take into account the full routing paths and aliases for the contents of the `dir/` directory. Since the `dir/` directory was aliased to `/`, its full path (relative to the server root) is `/`. The references `css/file.css` and `js/file.js` are equivalent to `/css/file.css` and `/js/file.js` respectively, and have the full path of the `dir/` directory's URI (`/`) accounted for, thus resulting in the successful reference.

---

## **Using Middleware as APIs**

As mentioned previously, routing configuration can be used to create APIs with the server root's directory routing process. This is a relatively new way to create APIs within the rjs2 system, replacing the old compatibility method of API creation. ~~For information about the old way of making APIs, see the guide `rjs2/guides/LegacyCreatingAPIs.md`.~~ The legacy method of creating APIs has been _**deprecated**_, and shouldn't be used.

## Routing Middleware

To create an API using middleware, use the `"apps"` option when configuring the routing with `_alconfig.json` (see the section on [configuring router behavior](#configure-routing-behavior) for details).

Unlike static content routing, middleware content routing _**does not**_ take advantage of include/exclude/alias features from the `_alconfig.json` file. Thus, you cannot use conventional methods to control the routing for the mapped middleware file. The following are equivalent methods of performing the same operations:

1. `alias`
    - Whereas `_alconfig.json` allowed you to specify an alias for a specific directory, using the `apps` option in the configuration will prevent you from doing this for linked middleware. Instead, you'd have to modify the app's containing directory to do this. consider the following example:

    ```
    rjs2/
    +-  public/
    |   +-  app/
    |   |   +-  app.js
    |   +-  dir2/
    |       +-  page1.html
    |       +-  page2.html
    +-  ...
    ```

    The following will not reroute the `app` endpoint to `b`:

    ```javascript
    {
        "alias": {
            "app": "b"          // <-- That won't work!
        },
        "apps": {
            "app": "app/app.js" // <-- Tells rjs2 to route "app/app.js" to "app"
        }
    }
    ```

    You'd have to rename the containing directory and update the `apps` entry:

    ```
    rjs2/
    +-  public/
    |   +-  b/              <-- Renamed directory to "b"
    |   |   +-  app.js
    |   +-  dir2/
    |       +-  page1.html
    |       +-  page2.html
    +-  ...
    ```

    ```javascript
    {
        "apps": {
            "b": "b/app.js" // <-- Tells rjs2 to route "b/app.js" to "b"
        }
    }
    ```

1. `include`/`exclude`
    - This is relatively straightforward. If you want to include a middleware endpoint as an API, you must explicitly specify it in the `apps` option of `_alconfig.json`. Otherwise, it will not be routed as an API:

    ```
    rjs2/
    +-  public/
    |   +-  a/
    |   |   +-  app.js
    |   +-  b/
    |       +-  app.js
    +-  ...
    ```

    ```javascript
    {
        "exclude": {
            "b": false      // Careful, don't forget that unless "b" is
                            // explicity excluded like so, it will STILL get
                            // routed as static content. Unless this is desired,
                            // you must put it in this blacklist!!!
        }
        "apps": {
            "a": "a/app.js" // <-- "a/app.js" will be routed as an API
        }
    }
    ```

---

## **Creating Middleware**

We've described how to route middleware using `_alconfig.json`, but haven't gone over how middleware should be constructed. This section aims to describe the different components of middleware and illustrate the creation of said middleware in a step-by-step fashion.

## Basic Structure

API middleware files in rjs2 have a basic fundamental structure that must be maintained. The following basic structure (i.e. all of the below contents) is _**REQUIRED**_ and _**NON-NEGOTIABLE**_, and each section's function is succinctly described by their respective comments:

```javascript
'use strict';   // Executes code body in Javascript Strict Mode

// Includes
const _lib = require( '/path/to/util/_lib.js' );    // *Change to a correct path
const bodyParser = require( 'body-parser' );
const express = require( 'express' );
// Any other libraries/classes/functions you need can be included here...

// Log initialization of API middleware to console and log files
_lib.Logger.log( `Initializing app`, new _lib.Class.HandlerTab(
    __filename.substring( _lib.settings.root.length ),
    'string'
).getTag() );

// Create exportable API middleware ExpressJS app and router
const app = express();
const router = express.Router();

// Configure app with content parsers
app.use( bodyParser.json( { strict: true } ) );
app.use( bodyParser.urlencoded( { extended: true } ) );

// Place API creation logic here
// ...
// ...
// ...

// Mount router relative to this app
app.use( '/', router );

// Export app
module.exports = app;
```

Typically, you can copy the above code _**as is**_ and place it in an `app.js` file in the desired API directory.

## Creating API Endpoints

While the previous section's content must not be changed (with the exception of the `const _lib` include path), your main area of concern as the API developer is in the section marked by the following:

```javascript
// Place API creation logic here
// ...
// ...
// ...
```

To create API endpoints for rjs2, the following content must be placed in that section:

1. `Creating an API Legend`
    - The `class ApiLegend` can be used to initialize an API documentation generator that can create docs while routing endpoints to an associated router. The following is an example of its use:

    ```javascript
    // Create an API legend for this API middleware file and link its router
    let api = _lib.ApiLegend.createLegend(
        'API title',        // You can customize this to represent the API name
        'API description',  // You can describe your API here
        router
    );
    ```

1. `Defining an API endpoint`
    - An API endpoint can be linked to the router by using `ApiLegend.register()` on the previously created instance of `class ApiLegend`:

    ```javascript
    api.register(
        'Do Thing', // A custom title for the API endpoint
        'GET',      // The request type (supported: GET/POST/PUT/DELETE)
        '/dothing', // API URI endpoint (subject to ExpressJS's endpoint rules)
        'Does it',  // A description of what this API endpoint does
        [...],      // API Argument Descriptor Array
        [...],      // API Return Value Descriptor Array
        doThing     // ExpressJS Endpoint Handler (or a ref to one)
    );
    ```

    - The `API Argument Descriptor Array` contains objects called `API Argument Descriptors`. The contents of these objects are used to describe the arguments that are passed to the API (for documentation purposes only; they do not influence the API's behavior). An `API Argument Descriptor` takes the following form:

    ```javascript
    {
        name: 'id',     // The name of the argument
        type: 'string', // The argument's accepted datatype
        desc: '...'     // the argument's description
    }
    ```

    - The `API Return Value Descriptor Array` contains objects called `API Return Value Descriptors`. The contents of these objects are used to describe the possible return values/response that are given by the API (for documentation purposes only; they do not influence the API's behavior). An `API Return Value Descriptor` takes the following form:

    ```javascript
    {
        condition: 'On success',    // The condition to receive this response
        desc: 'Returns code 200'    // A description of the response
    }
    ```

    - The `ExpressJS Endpoint Handler` is a function (or a reference to one) that defines how the API endpoint should behave. This is where you control what the API can do and how it should respond. For more details on how to create this function, see ExpressJS's [website](https://expressjs.com/en/guide/writing-middleware.html). It takes the following form:

    ```javascript
    function( request, response, next ) {

        // Do thing(s) here...
        // NOTE: The "next" parameter is optional; see ExpressJS Website for
        // more details.
    }
    ```

1. `Repeat`
    - You may repeat step 2 for as many API endpoints as you like.

---
