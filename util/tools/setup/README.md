# **rjs2 Server Setup Utility**

A setup utility tool that sets up all basic server components required to run
the server.

Current Version: v0.0.3 (Alpha)

Last Upadted: 2019-11-17

---

## **Table of Contents**

- [Dependencies](#dependencies)
- [Directory Structure](#directory-structure)
- [OS-Specific Setup Scripts](#os-specific-setup-scripts)
- [Customizing OS-Specific Setup Script Behavior](#customizing-os-specific-setup-script-behavior)
- [Release Notes](#release-notes)

---

## **Dependencies**

- NodeJS v8.9.1+

---

## **Directory Structure**

The setup utility uses various resources within this directory to setup basic
server components. The following is a description of the contents of the
`setup/` directory:

### _**README**_

> This file.

### _**setup.js**_

> The setup utility, itself. Run `node setup.js -h` for usage instructions.

### _**res/**_

> Contains various resources essential to the setup script. Includes:

- _**help.txt**_

  > The setup utility's help prompt text.

- _**required.json**_

  > A JSON file containing information about the required directories and files for the server to properly work after setup.

- _**defaults/**_

  > Contains default values and files for server configuration. The files in this directory are used by the setup utility when no corresponding override files exist in the `custom/` directory.

  - _**files**_

    > Contains default file templates used in required file setup.

- _**custom/**_

  > Contains custom values and files for server configuration. The structure of this directory should mirror the structure of the `defaults/` directory as much as possible. For more information, read about the `setupRequiredFiles.js` setup script in [the next section](#os-specific-setup-scripts).

### _**scripts/**_

> Contains different scripts required for each individually supported OS. See [the next section](#os-specific-setup-scripts) for more details.

---

## **OS-Specific Setup Scripts**

The `scripts/` directory contains a directory for each currently supported OS.
For example, the `scripts/Linux/` directory contains setup scripts that are used
in a Linux (Ubuntu/Debian) environment (*plans for support of Windows and MacOS
are undergoing evaluation*). Each setup script must take the form illustrated in `boilerplateSetupScript.js`.

> **CAUTION:** In order for the setup utility to consistently interpret and run the scripts in the same fashion, it is assumed that each setup script returns only two possible values. On success, the return value must be set to the boolean value `true`. On any error, the return value must be an instance of class `ServerError` defined in `util/_lib.js`.

In each directory, a minimum of the following setup scripts must exist:

### _**checkForNodeJS.js**_

> Contains logic for the corresponding OS to search for and verify the version of NodeJS.

### _**checkForNpm.js**_

> Contains logic for the corresonding OS to search for and verify the version of Node Package Manager.

### _**installNodeModules.js**_

> Contains logic to automatically install NodeJS modules with npm.

### _**setupRequiredDirs.js**_

> Contains logic for the corresponding OS to ensure the existence of all required server directories defined in res/required.json (see the [previous section](#directory-structure) for more details).

### _**setupRequiredFiles.js**_

> Contains logic for the corresponding OS to ensure the existence of all required server files defined in res/required.json (see the [previous section](#directory-structure) for more details). By default, this script executes a simple copy-paste operation on required files contained in `res/defaults/files/`. If a required file exists in `res/custom/files/`, this file will be used instead of its default counterpart.

### _**setupSymbolicLinks.js**_

> Contains logic for the corresponding OS to ensure that all required symbolic links/shortcuts are created for the server instance.

---

## **Customizing OS-Specific Setup Script Behavior**

The following files can be added to each directory to configure setup script
execution behavior:

### _**order.json**_

> A JSON file that describes the exact order to run the setup scripts. It must
> take the following form:
> ```json
> {
>   "order": [
>     "firstScriptToRun.js",
>     "secondScriptToRun.js",
>     ...
>   ]
> }
> ```
> where `order` is an array of setup script names contained within the
> corresponding OS's setup script directory. Note that including the order.json
> file in the OS's setup script directory requires `order` to define the run
> order of **ALL** setup scripts within the OS's setup script directory. Any
> script not included in `order` will therefore _not_ be executed.

#### Note:

> A default `order.json` has been provided with the recommended execution order of the current set of mandatory scripts listed in the [previous section](#os-specific-setup-scripts)

---

## **Release Notes**

- **Alpha**
  - A way to improve the setup script output of `installNodeModules.js` for Linux is being considered.
