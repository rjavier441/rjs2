# rjs2 User Guide: Creating Web Content

An in-depth guide illustrating how to create web content in rjs2.

Current Version: v0.0.0 (Alpha)

Last Updated: 2020-01-26

---

## **Table of Contents**

- [Directory Structure](#directory-structure)
- [Web Content In General](#web-content-in-general)
- [Server-Side Content Routing](#server-side-content-routing)
    - [Routing Process](#routing-process)
    - [Configure Routing Behavior](#configure-routing-behavior)
- [Client-Side Content Referencing](#client-side-content-referencing)

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

The rjs2 server starts its routing by entering the server root and recursively traverses each directory unless configured to do otherwise.

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
- `apps` _(Under Development)_
    - A map of directory names to paths of app/router middleware files (relative to the current directory) that will handle all endpoints under the corresponding directory name. If this argument is omitted, content is treated as static web content and exposed to the public based on the provided alias, include and exclude parameters. If this argument is given, the specified app/router middleware file will be routed to the current endpoint, and no further depth-first traversal will occur for the current directory.

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