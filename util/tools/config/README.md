# **rjs2 Server Configuration Utility**

A setup utility tool that enables the user to configure server settings.

Current Version: v0.0.1 (Alpha)

Last Upadted: 2019-11-28

---

## **Table of Contents**

- [Dependencies](#dependencies)
- [Directory Structure](#directory-structure)
- [OS-Specific Config Scripts](#os-specific-config-scripts)
- [Customizing OS-Specific Config Script Behavior](#customizing-os-specific-config-script-behavior)
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

### _**config.js**_

> The configuration utility, itself. Run `node config.js -h` for usage instructions.

### _**res/**_

> Contains various resources essential to the configuration script. Includes:

- _**help.txt**_

  > The configuration utility's help prompt text.

### _**scripts/**_

> Contains configuration scripts custom-tailored different supported OS. See [the next section](#os-specific-config-scripts) for more details.

---

## **OS-Specific Config Scripts**

The `scripts/` directory contains a directory for each currently supported OS. For example, the `scripts/Linux/` directory contains configuration scripts that are used in a Linux (Ubuntu/Debian) environment (*plans for support of Windows and MacOS are undergoing evaluation*). Each config script must take the form illustrated in `boilerplateConfigScript.js`.

In each directory, a minimum of the following config scripts must exist:

### _**configSecurity.js**_

> Contains logic that enables the user to customize security settings for the server.

---

## **Customizing OS-Specific Config Script Behavior**

The following files can be added to each directory to configure script execution behavior:

### _**order.json**_

> A JSON file that describes the exact order to run the config scripts. It must
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
> where `order` is an array of config script names contained within the
> corresponding OS's config script directory. Note that including the order.json
> file in the OS's config script directory requires `order` to define the run
> order of **ALL** config scripts within the OS's setup script directory. Any
> script not included in `order` will therefore _not_ be executed.

---

## **Release Notes**

- **Alpha**
  - Currently, `config.js` doesn't gracefully handle promise rejections. Development of a solution to this is in the backlog.
