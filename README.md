# rjs2

A complete redesign of RJS, a server package meant to run a MExN web stack. It comes fully equipped to run as either a Web Server or a RESTful API server, giving you the freedom to customize it to your needs.

Current Version: v0.0.32 (Alpha)

Last Updated: 2020-01-26

---

## **Table of Contents**

- [Quick Start](#quick-start)
    - [Install Prerequesites](#install-prerequesites)
    - [Setup and Configuration](#setup-and-configuration)
    - [Start Server](#start-server)
- [Dependencies](#dependencies)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Release Notes](#release-notes)

---

## **Quick Start**

When acquired, the server needs to be setup with prerequesite libraries and configurations. To do this, you can follow this sequence of steps:

### **Install Prerequesites**

1. Install [`NodeJS`](https://nodejs.org/) and `NPM` (`NPM` usually comes with `NodeJS`)
1. Enter the server project's directory (e.g. `rjs2/`)
1. Run `npm install` (or `npm i` for newer NPM systems) to install NPM Packages and Database Drivers
1. **(Optional)** Install your desired database(s) and corresponding drivers
    > MongoDB and MySQL drivers for NodeJS were included in `npm install`, but feel free to add others as desired
1. **(Optional)** Setup/Configure your database(s) as desired

### **Setup and Configuration**

1. Basic Setup Routine
    1. Enter the `rjs2/util/tools/setup/` directory
    1. Run `node setup.js -A` _(You may read its documentation for more details)_
1. **(Optional)** Configuration for Secure Mode (HTTPS/SSL) operation
    1. Enter the `rjs2/util/tools/config/` directory
    1. Run `node config.js -A` and follow the prompts _(You may read its documentation for more details)_

Once setup is complete, the server package will have all resources it needs to run in _**insecure mode**_ (i.e. without HTTPS/SSL). To enable the server to run in securely, you must obtain CA certificates and any other required SSL/PKI files from a valid Certificate Authority, then complete configuration by performing the optional steps above.

### **Start the Server**

You can start the server by running `rjs2/server.js` with NodeJS on the command line. By default, the server is set to run in _**secure mode**_ using HTTPS/SSL, but will not operate in this mode without proper configuration (see the [previous section](#setup-and-configuration)) and CA certification, which must be obtained separately from a Certificate Authority.

Assuming you are in the `rjs2/` directory, below are some short-hand conventions to run the server in different contexts:

- Run in Secure Mode (Default)
    - `node server.js`
- Run in Insecure Mode
    - `node server.js -i`
- Run with Verbose Logging (i.e. enables console output)
    - `node server.js -v`
- Run in a Custom Port
    - `node server.js -p [some port number here...]`

Run `node server.js -h` for more details.

---

## **Dependencies**

- Body-Parser v1.19.0+
- Chai v4.2.0+
- EJS v2.7.1+
- ExpressJS v4.17.1+
- Minimist v1.2.0+
- Mocha v6.2.2+
- MongoDB NodeJS Driver v3.3.3+
- MySQL NodeJS Driver v2.17.1+
- NodeJS v8.9.1+
- Sinon v7.5.0+

---

## **Frequently Asked Questions**

## How To

- _...change the default log file storage directory?_
    - Open `rjs2/util/settings.js`
    - Change `this.logdir` to a path you prefer
- _...change the default port?_
    - Open `rjs2/util/settings.js`
    - Change `this.port` to any port number you desire
- _...log stuff to console?_
    - You can use the native JavaScript `console.log()` function to log to the console window, but it is recommended to use the `Logger.log()` function from `class Logger` instead, since this class has the added functionality of storing console outputs to the server log files. This class is accessible within your server backend code (or APIs) by:
        - ...requiring `_lib.js` and accessing it indirectly (e.g. `var logger = require('...path to rjs2/util/...' + '_lib.js' ).Logger`), or by
        - ...directly including it using its full path (e.g. `var logger = require( '...path to rjs/util/...' + 'logger.js' )`).
    - You can read more about `class Logger` by reading the source-code documentation in the `rjs2/util/logger.js` file

## General Questions

- _If I don't run the server with Verbose Logging turned on, will the server still record console output?_
    - Yes, as long as you use `class Logger` to output to console using `_lib.Logger.log("...")`. This class is accessible within your server backend code (or APIs) by:
        - ...requiring `_lib.js` and accessing it indirectly (e.g. `var logger = require('...path to rjs2/util/...' + '_lib.js' ).Logger`), or by
        - ...directly including it using its full path (e.g. `var logger = require( '...path to rjs/util/...' + 'logger.js' )`).
        
    - By using `_lib.Logger.log()` to log to console, console output may still be stored in log files under the log directory (default is `rjs2/log`; to customize, see the [previous section](#how-to)).

---

## **Release Notes**

- Currently supports `Linux` and `Windows`. Plans for `MacOS` support are being developed.
- 2020-01-20
    - Currently improving various documentation and utilities within the server
- 2020-01-19
    - **(DONE)** ~~Providing initial setup and support for `Windows` deployments~~
- 2019-12-10
    - **(DONE)** ~~Redesigning the static content and API sub-application loading system for rjs2~~
- 2019-11-27
    - **(DONE)** ~~Creating/Documenting `util/tools/config/config.js`, which will allow user prompting for creation of security.js, as well as future configuration files.~~
