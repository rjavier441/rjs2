# rjs2

A complete redesign of RJS, a server package meant to run a MExN web stack. It comes fully equipped to run as either a Web Server or a RESTful API server, giving you the freedom to customize it to your needs.

Current Version: v0.0.0 (Alpha)
Last Updated: 2019-11-24

---

## **Table of Contents**

- [Quick Start](#quick-start)
    - [Install Prerequesites](#install-prerequesites)
    - [Setup and Configuration](#setup-and-configuration)
- [Dependencies](#dependencies)
- [Release Notes](#release-notes)

---

## **Quick Start**

When acquired, the server needs to be setup with prerequesite libraries and configurations. To do this, you can follow this sequence of steps:

### **Install Prerequesites**

1. Install `NodeJS` and `NPM` (`NPM` usually comes with `NodeJS`)
1. Run `npm install` to install NPM Packages and Database Drivers
1. (Optional) Install your desired database(s) _(MongoDB and MySQL drivers for NodeJS were included in `npm install`, but feel free to add others as desired)_
1. (Optional) Setup/Configure your database(s) as desired

### **Setup and Configuration**

1. Enter the `util/tools/setup/` directory
1. Run `node setup.js` _(You may read its documentation for more details)_
1. Enter the `util/tools/config/` directory
1. Run `node config.js` and follow the prompts _(You may read its documentation for more details)_

Once setup is complete, the server package will have all resources it needs to run. Start the server using `node server.js` _(add option `-h` for more details)_.

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

## **Release Notes**

- Currently supports `Linux`. Plans for `Windows` and `MacOS` support are being developed.
- 2019-11-27
    - **(DONE)** ~~Currently working to create/document `util/tools/config/config.js`, which will allow user prompting for creation of security.js, as well as future configuration files.~~