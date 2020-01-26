# rjs2 User Guide: Creating APIs

An in-depth guide explaining how to create APIs to mount on the server.

Current Version: v0.0.0 (Alpha)

Last Updated: 2019-11-30

---

## **Table of Contents**

- [Directory Structure](#directory-structure)
- [APIs in General](#apis-in-general)
- [RESTful APIs in rjs2](#restful-apis)
    - [API Url Structure](#api-url-structure)
- [API Placement](#api-placement)
- [Basic API Structure](#basic-api-structure)
  - [API Structure Breakdown](#api-structure-breakdown)
- [Example API Creation](#example-api-creation)
- [Release Notes](#release-notes)

---

## **Directory Structure**

```
rjs2/
+-  api/
|   +-  app/
|       +-  app.js
|       +-  routes/
|           +-  [API Direcotry 0]
|           |   +-  index.js
|           |
|           +-  [API Directory 1]
|           |
|           +-  ...
|           |
|           +-  [API Directory N]
|       
+-  ...
```

---

## **APIs in General**

In general, APIs (Application Programming Interfaces) are protocols and routines that enable intercommunication between your application(s) and service(s) for the overall goal of building/connecting them. In the context of this server, the applications and services that intercommunicate are one or more client web/mobile applications (internal to this server or external depending on your design) and the server application, itself. APIs enable client applications to interact with and query the server application logic you create, without having to know the implementation.

---

## **RESTful APIs in rjs2**

The server's APIs are intended to operate as RESTful APIs, meaning they follow the REST API standard and are accessible via the standardized set of HTTP(S) web requests. Thus, APIs can be interacted with via the sending of GET/POST/PUT/DELETE/etc. requests to the server at the appropriate endpoint (i.e. the appropriate URL).

The rjs2 server maps endpoints using the following url structure:

> ### API Url Structure:
> `[http|https]://[hostname][:port]/api/[apiName]/[endpointName]`

As an example, assume your `rjs2` root server instance is accessible via the url `https://www.myserver.com`, and your API `myApi` has an endpoint `doThing` that simply returns the text `"hello world"` when sending a GET request to it. The server maps app APIs under the `/api` URL noun, so you can access your API by sending a GET request to `https://www.myserver.com/api/`_**`myApi`**_`/`_**`doThing`**_, which will return the result text to you. You can read more about RESTful protocol and HTTP web requests online.

---

## **API Placement**

APIs are stored under the `api/app/routes/` directory. The name of each directory housing API logic makes up the `apiName` parameter of the [API Url Structure](#api-url-structure). For example, assume you have an API directory `api/app/routes/myApi` under your rjs2 root server instance at `https://www.myserver.com`. Your API's endpoints would be mounted under `https://www.myserver.com/api/`_**`myApi`**_`/`_**`[endpointName]`**_. You can read more about API directories in [the next section](#basic-api-structure).

---

## **Basic API Structure**

Creating APIs in `rjs2` is straightforward, provided that you understand their implementation within the server. Each API conforms to a basic structure exemplified by the `api_skeketon/` API directory to enable the automated mounting of APIs:

- `index.js`
  - The API logic for this API. This file contains source code that maps API endpoints to an API named after its parent directory. **CAUTION:** The server requires that each API's endpoint mapping logic is contained within a file under this name. **Do not** change the name of the `index.js` file within the API directory!

The `index.js` file's basic form is exemplified by the example shown in `api_skeleton/index.js`:

```javascript
'use strict';

// The minimum required includes and libraries
const _lib = require( '../../../../util/_lib.js' );
const express = require('express');
const router = express.Router();

// Intantiate an API mapper here
var api = _lib.ApiLegend.createLegend(
  'Name of your API (for documentation purposes only)',
  'Description of your API (for documentation purposes only)',
  router
);

// Create a container for API metadata here
var apiInfo = {
  args: {},
  rval: {}
};

// EXAMPLE API ENDPOINT:
// Define the arguments for this API's request (i.e. querystring parameters for
// GET requests, or request body parameters for POST requests).
apiInfo.args.example = [
  /* Insert API Argument Descriptor Objects here */
];

// Define the return values for this API's response (i.e. response code and
// body)
apiInfo.rval.example = [
  /* Insert API Return Value Descriptor Objects here */
];

// Map the API by registering it with the API mapper
api.register(
  'Name of your API Endpoint (for documentation purposes only)',
  'Request type in uppercase (i.e. GET, POST, DELETE, PUT, etc.)',
  '/endpointName',  // requires a prefixed forward slash
  'Description of your API Endpoint (for documentation purposes only)',
  apiInfo.args.example,
  apiInfo.rval.example,
  callbackFunction
);

// Export the api router
module.exports = router;
```

Next, let's explore the different parts of the structure above.

## API Structure Breakdown

```javascript
'use strict';

// The minimum required includes and libraries
const _lib = require( '../../../../util/_lib.js' );
const express = require('express');
const router = express.Router();
```

The above code does two key things:

1. Implementing `'use strict';` forces `NodeJS` to run the entire script in strict mode, which disables the silent omission/ignorance of certain errors. You can read more about strict mode online from this [Mozilla Developer Network article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode).
1. Includes the minimum libraries required to implement the API logic.
    - `_lib` is a contant reference to rjs2's core libraries and utilities. Its include path is always set to point to `rjs2/util/_lib.js`, either via fullpath or a path relative to the current script file (as in the above example).
    - `express` is a constant reference to the ExpressJS Middleware Web Framework, which provides the tools needed to map each API endpoint's `callbackFunction` to their respective RESTful API endpoint. You can read more about ExpressJS from their [website](https://expressjs.com/).
    - `router` is a construct within ExpressJS that enables custom API endpoint routing to user-defined endpoints, a key feature of the `_lib.ApiLegend` library.

```javascript
// Intantiate an API mapper here
var api = _lib.ApiLegend.createLegend(
  'Name of your API (for documentation purposes only)',
  'Description of your API (for documentation purposes only)',
  router
);
```

The above code creates an instance of the _API Mapper Class_ `ApiLegend`. While its main purpose is to map API endpoints to the `router` you instantiated in the previous code block, it also contains internal utilities to generate API documentation for your reference.

```javascript
// Create a container for API metadata here
var apiInfo = {
  args: {},
  rval: {}
};
```

The above snippet is where all API metadata is stored. Its sole purpose is to record information about your APIs that will be used by the _API Mapper Class_ instance to generate API documetation.

The `apiInfo.args` member acts as an argument map for each endpoint under this API's name. Similarly, the `apiInfo.rval` member performs the same function, but for API response return values instead. Their use is illustrated in the following snippet:

```javascript
// EXAMPLE API ENDPOINT:
// Define the arguments for this API's request (i.e. querystring parameters for
// GET requests, or request body parameters for POST requests).
apiInfo.args.example = [
  /* Insert API Argument Descriptor Objects here */
];

// Define the return values for this API's response (i.e. response code and
// body)
apiInfo.rval.example = [
  /* Insert API Return Value Descriptor Objects here */
];

// Map the API by registering it with the API mapper
api.register(
  'Example',
  'GET',
  '/example',  // requires a prefixed forward slash
  'Description of your API Endpoint (for documentation purposes only)',
  apiInfo.args.example,
  apiInfo.rval.example,
  callbackFunction
);
```

The above code section represents an example API endpoint named `example`, represented by the third argument to the `api.register()` function call (we'll return to that later). While not strictly required, it is recommended that you follow the nomenclature of your API endpoint when defining your argument and return value mappings. This is illustrated above, since the argument array `apiInfo.args.`_`example`_ and return value array `apiInfo.rval.`_`example`_ are named to match the API endpoint's name (i.e. `example`).

Each API endpoint's argument and return value array describe their arguments and return values, respectively. For arguments, they are represented by **API Argument Descriptors**, which are plain JavaScript objects that take the following form:

```javascript
// API Argument Descriptor
{
  name: 'username',
  type: '~string',    // Prefixing with '~' means this argument is optional
  desc: 'The password to store in the database'
}
```

where `name` is the argument's name, `type` is its datatype and necessity level (indicated by a `~` if the argument is optional), and `desc` is a description of the argument, which can be as verbose as you desire.

Similarly, return values take the form of **API Return Value Descriptors**, as the example shown below:

```javascript
// API Return Value Descriptor
{
  condition: 'On success',
  desc: 'Returns a code 200, and a success message'
}
```

where `condition` describes the condition required for this response value to be returned, and `desc` is a description of what is returned. Typically since the nature of the applications under rjs2 are web-based, it is recommended that the `desc` include both the returned response code and a description of response return value, as shown above.

Let's return to the call to `api.register()`:

```javascript
// Map the API by registering it with the API mapper
api.register(
  'Example',
  'GET',
  '/example',  // requires a prefixed forward slash
  'Description of your API Endpoint (for documentation purposes only)',
  apiInfo.args.example,
  apiInfo.rval.example,
  callbackFunction
);
```

The above code is where it all comes together to finally create and map the API endpoint. The `api.register()` function is a member function of `class ApiLegend`, and has the following function signature:

```javascript
ApiLegend.register( name, method, route, desc, args, returnVal, cb );
```

A high-level description of the parameters of `ApiLegend.register()`:

- `name`
    - The API endpoint's name (for documentation purposes only)
- `method`
    - The HTTP request method to associate to this API endpoint (i.e. GET, POST, PUT, DELETE, etc.)
- `route`
    - The API URI string that this enpoint will be mapped to
- `desc`
    - A description of the API endpoint (i.e. its function)
- `args`
    - A reference to this API endpoint's argument metadata (i.e. `apiInfo.args.`_`endpointName`_)
- `returnVal`
    - A reference to this API endpoint's return value metadata (i.e. `apiInfo.rval.`_`endpointName`_)
- `cb`
    - A callback function to run. Takes the same form as callback functions for ExpressJS's `app.METHOD()` functions (see the [documentation](https://expressjs.com/en/4x/api.html#app.get.method) for more info).

The callback function `cb` is where you will put your API handler logic.

Finally, the end of the file is particularly important:

```javascript
module.exports = router;
```

The `module.exports` line is a NodeJS convention for exporting classes and functions as Node modules under a single namespace, but you can think of it as the return value for the entire file.

After all API endpoints are defined and mapped, the `router` object will have all it needs to service API requests at the endpoint URLs you specified. The above code pass the router to the server, which will then mount all endpoints under the `index.js` file's API namespace name, whose value is the file's parent folder name (in this case, `api_skeketon`. Thus, once the server successfully mounts the endpoints to `api_skeleton`, the endpoints are accessible via the URL path `https://www.myserver.com/api/api_skeleton/`_`endpointName`_.

---

## **Example API Creation**

Let's walk through the API creation process via an example. The goal is to create an API named `myApi`. It will have two endpoints `ping` and `add`. The `ping` endpoint will simply return `"hello world"` to the client, while `add` will add two numbers given to the server and return the result.

## 1. Create the API Directory

Assuming our `rjs2` root server instance is accessible via `https://www.myserver.com/`, let's create an API directory named `rjs2/api/app/routes/myApi`:

```
rjs2/
+-  api/
|   +-  app/
|       +-  app.js
|       +-  routes/
|           +-  myApi/        <---- Here's the API directory
|               +-  index.js
|       
+-  ...
```

Because the directory's name is `/myApi`, the API's endpoints will be automatically mapped under the API url `https://www.myserver.com/api/`_`myApi`_`/`, which matches the directory name.

## 2. Initialize the API Endpoint File

Within the `myApi/` directory, the `index.js` file will be created to house our API definitions. At the start, it will contain all minimum requirements for rjs2 APIs as defined in the [previous section](#basic-api-structure):

```javascript
'use strict';

const _lib = require( '../../../../util/_lib.js' );
const express = require('express');
const router = express.Router();
```

## 3. Create an API Mapper Instance and Metadata Container

Add the following to the file. Note the aptly named API name and description:

```javascript
// Intantiate an API mapper here
var api = _lib.ApiLegend.createLegend(
  'My Api',
  'This is an example API allowing users to ping a message or add numbers',
  router
);

// Create a container for API metadata here
var apiInfo = {
  args: {},
  rval: {}
};
```

## 4. Create API Endpoints

Let's start with the `ping` endpoint, since it's the simplest. Since `ping` is only intended to return a predefined value, it doesn't need anything fancier than a `GET` request to return data. Furthermore, it won't take any arguments, and will only return a string `"hello world"` on a success (HTTP Code 200). With this in mind, the callback function only needs to return `"hello world"` (a string) as plaintext via the response object provided in the callback function signature. Therefore, we end up with the following code to add:

```javascript
apiInfo.args.ping = [];   // no arguments

apiInfo.rval.ping = [
  {
    condition: 'On success',
    desc: 'Returns a code 200 and the string "hello world"'
  }
];

api.register(
  'Ping Server',
  'GET',
  '/ping',
  'Pings the server for a test message.',
  apiInfo.args.ping,
  apiInfo.rval.ping,
  function( request, response ) {

    // Get the arguments from the GET request querystring
    var args = request.params;

    // Ignore this for now, but keep it in the function exactly as is
    var ht = new _lib.Class.HandlerTag( this, 'api' );

    // Set the response type to plaintext
    response.set( 'Content-Type', 'text/plain' );

    // Here's where you respond to the client
    response.send( 'hello world' )  // Send the string to the client
    .status( 200 )                  // Send the success code 200 to the client
    .end();                         // Signal the end of the HTTP transaction

    // (Optional, but highly encouraged) Log the request details/result
    _lib.Logger.log(
      `Sending ping message to client @ ip ${request.ip}`,
      ht.getTag()
    );
  }
);
```

Now let's move on to the `add` endpoint. Since `add` requires the client to specify two numbers to add, it's probably fitting to use a `POST` request, which will enable the server to pass the numbers to the API endpoint callback via the `request` object. Furthermore, let's say we wanted to return the result to the client as an object like `{ sum: 3 }`, meaning we'd need to set its content type to `application/json`. Thus, the callback would only need to take the two numbers (let's call them `a` and `b`) from the `request`, add them, then return the result via the `response` as an object. Therefore, the resulting code to add would look like this:

```javascript
apiInfo.args.add = [
  {
    name: 'a',
    type: 'number',
    desc: 'The first number'
  },
  {
    name: 'b',
    type: 'number',
    desc: 'The second number'
  }
];

apiInfo.rval.add = [
  {
    condition: 'On success',
    desc: 'Returns a code 200 and sum in an object (e.g. { sum: ... } )'
  }
];

api.register(
  'Add two numbers',
  'POST',
  '/add',
  'Provides the sum of two given numbers to the client.',
  apiInfo.args.add,
  apiInfo.rval.add,
  function( request, response ) {

    // Ignore this for now, but keep it in the function exactly as is
    var ht = new _lib.Class.HandlerTag( this, 'api' );

    // Get the arguments from the POST request body
    var args = request.body;
    var a = args.a;
    var b = args.b;

    // Create the sum object
    var result = { sum: a + b };

    // Set the response type to json
    response.set( 'Content-Type', 'application/json' );

    // Here's where you respond to the client
    response.send( result )         // Send the result to the client
    .status( 200 )                  // Send the success code 200 to the client
    .end();                         // Signal the end of the HTTP transaction

    // (Optional, but highly encouraged) Log the request details/result
    _lib.Logger.log(
      `Sending sum "${result.sum}" to client @ ip ${request.ip}`,
      ht.getTag()
    );
  }
);
```

## 5. Pass API Router to Server

With both API endpoints mapped, you can now end the `index.js` file with the final export statement:

```javascript
module.exports = router;
```

## 6. (Optional) Test the API

While it is not required, it's always a good idea and encouraged to test your API and make sure it works. Sending requests to your server can be done through a web browser or terminal web client like `CURL` for `Linux`, but [Postman](https://www.getpostman.com/) is recommended.

With this, you can now develop your own APIs to do more useful tasks. Happy coding!

---

## **Release Notes**

- Alpha
    - 2019-11-30: Implementation of `ejs` and `class ApiLegend` to generate documentation docs accessible via API is not currently implemented. This is in queue and undergoing evaluation.

---
