# rjs2 Server Setup Utility

A setup utility tool that sets up all basic server components required to run
the server.

Current Version: v0.0.0 (Alpha)

---

## Table of Contents

- [Dependencies](#dependencies)
- [Directory Structure](#directory-structure)
- [OS-Specific Setup Scripts](#os-specific-setup-scripts)

---

## Dependencies

- NodeJS v8.9.1+

---

## Directory Structure

The setup utility uses various resources within this directory to setup basic
server components. The following is a description of the contents of the
`setup/` directory:

### _**README.md**_

> This file.

### _**setup.js**_

> The setup script, itself. Run `node setup.js -h` for usage instructions.

### _**res/**_

> Contains various resources essential to the setup script. Includes:

- _**help.txt**_

  > The script's help prompt text.

- _**required.json**_

  > A JSON file containing information about the required directories and files for the server to properly work after setup.

### _**scripts/**_

> Contains the different scripts required for each individually supported OS.
> See [the next section](#os-specific-setup-scripts) for more details.

---

## OS-Specific Setup Scripts

The `scripts/` directory contains a directory for each currently supported OS.
For example, the `scripts/Linux/` directory contains setup scripts that are used
in a Linux (Ubuntu/Debian) environment (*plans for support of Windows and MacOS
are undergoing evaluation*). In each directory, the following setup scripts exist:

### _**checkForNodeJS.js**_

> Contains logic for the corresponding OS to search for and verify the version
> of NodeJS.

<br>

Each setup script must take the form illustrated in `boilerplateSetupScript.js`.
> **CAUTION:** In order for the setup utility to consistently interpret and run
> the scripts in the same fashion, it is assumed that each setup script returns
> only two possible values. On success, the return value must be set to the
> boolean value `true`. On any error, the return value must be an instance of
> class `ServerError` defined in `util/_lib.js`.

<br>

The following files can be added to each directory to configure setup script
execution behavior:

### _**order.json**_

> A JSON file that describes the exact order to run the setup scripts. It must
> take the following form:
> ```
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
