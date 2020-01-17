//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					templateManager.js
//	@Date Created:	2020-01-17
//	@Last Modified:	2020-01-17
//	@Details:
//									This file provides a common interface for rjs2 applications
//	                to dynamically create HTML pages using the EJS library
//	                (embedded javascript templates).
//	@Dependencies:
//									EJS v2.7.1+
//	                NodeJS v8.9.1+
//									ExpressJS v4+
// 					        body-parser		    (NPM middleware req'd by ExpressJS 4.x
//	                                  to acquire POST data parameters:
//	                                  "npm install --save body-parser")

'use strict'

// Includes
const settings = require( './settings.js' );
const DependencyInjectee = require(
  `${settings.util}/class/dependencyInjectee.js`
);

// Dependencies
const ejs = require( 'ejs' );
const fs = require( 'fs' );

// BEGIN TemplateManager Config Documentation
// @config			  Templates in general
// @description		Templates are pulled from the "templateDir" directory of the
//	              "settings" parameter.
//
// @config        Simple EJS File Templates
// @description   These template files are intended to be simple templates, and
//	              should not require complex nesting beyond .ejs html blocks. A
//	              simple template file should consist of one main .ejs file that
//	              shares an identical name with its parent directory (without
//	              the ".ejs" extension, of course), any blocks of .ejs html
//	              in a "block/" directory on the same level as the main ".ejs"
//	              file, and a global ".css" file to be embedded into the main
//	              ".ejs" file.
// END TemplateManager Config Documentation

// BEGIN class TemplateManager
class TemplateManager extends DependencyInjectee {

  // @ctor
  // @parameters		n/a
  constructor( deps ) {
    super( deps );
  }

  // @function			generate()
  // @description		Generates HTML content from the given EJS template with the
  //	              specified parameters. This method is intended to load very
  //	              "simple" EJS file templates. See the config documentation
  //	              above for more details.
  // @parameters		(string) name         The name of the template to use. This
  //	                                    name correspond's to the containing
  //	                                    directory of a template .ejs file and
  //	                                    the name of the .ejs file, itself
  //	                                    (i.e. if the desired template was
  //	                                    "abc.ejs", the file would need to be
  //	                                    stored in a template directory of the
  //	                                    same name "abc/"). Then, the correct
  //	                                    "name" to use would be "abc". See the
  //	                                    above config documentation for details
  //	                                    regarding TemplateManager's template
  //	                                    directory.
  //	              (object) args         A map of various arguments that the
  //	                                    template takes. See the specified .ejs
  //	                                    template for the specific set of args
  //	                                    required by the template.
  // @returns				n/a
  static generate( name, args ) {

    let template = fs.readFileSync(
      `${settings.templateDir}/${name}/${name}.ejs`,
      'utf-8'
    );
    args.templateCss = fs.readFileSync(
      `${settings.templateDir}/${name}/${name}.css`,
      'utf-8'
    );
    let ejsOptions = {
      'filename': name,
      'cache': true,
      'strict': true
    };

    return ejs.render( template, args, ejsOptions );
  }
}
// END class TemplateManager

module.exports = TemplateManager;
// END templateManager.js
