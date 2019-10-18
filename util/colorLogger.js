//	PROJECT:				rjs2
//	Name:						R. Javier
//	File:						colorLogger.js
//	Date Created:		2019-10-17
//	Last Modified:	2019-10-17
//	Details:
//									Defines a color logger utility class to print color messages
//	                to console.
//	Dependencies:
//									NodeJS v8+

'use strict';

// BEGIN class ColorLogger
class ColorLogger {
  
  // @ctor
  constructor() {

  }
}

// @property			colors
// @description		Defines byte codes for fancy text coloring.
ColorLogger.colors = {		// Text Color Codes for Any Terminal; based
	"Reset": "\x1b[0m",               // on the ANSI standard
	"Bright": "\x1b[1m",
	"Dim": "\x1b[2m",
	"Underscore": "\x1b[4m",
	"Blink": "\x1b[5m",
	"Reverse": "\x1b[7m",
	"Hidden": "\x1b[8m",

	"FgBlack": "\x1b[30m",
	"FgRed": "\x1b[31m",
	"FgGreen": "\x1b[32m",
	"FgYellow": "\x1b[33m",
	"FgBlue": "\x1b[34m",
	"FgMagenta": "\x1b[35m",
	"FgCyan": "\x1b[36m",
	"FgWhite": "\x1b[37m",

	"BgBlack": "\x1b[40m",
	"BgRed": "\x1b[41m",
	"BgGreen": "\x1b[42m",
	"BgYellow": "\x1b[43m",
	"BgBlue": "\x1b[44m",
	"BgMagenta": "\x1b[45m",
	"BgCyan": "\x1b[46m",
	"BgWhite": "\x1b[47m"
};

// @property			styles
// @description		Defines byte codes for fancy text styleing.
ColorLogger.styles = {	// Text Decoration Codes for Any Terminal;
	"Bold": "\u001b[1m",            // based on the ANSI standard
	"Underline": "\u001b[4m",
	"Reverse": "\u001b[7m"
};

// @function			log()
// @description		A static function of the ColorLogger class that enables
//	              console logging of messages in unique styles/formats
// @parameters		(string) message			The message to print.
//	              (~object) options			A JSON object containing configuration
//																			options. It may have any of the
//																			following properties:
//									(~string) append			A string to append after the formatted
//																				message. This is typically used to add
//																				breaks and spacing after the nicely
//																				formatted message.
//									(~string) prepend			A string to prepend before the format-
//																				ted message. This is useful if you
//																				want to place some normal style text
//																				before a nicely formatted message.
//									(~string) theme				The type of message coloring theme to
//																				apply. Currently supported message
//																				themes include:
//
//																				"complete"		black bkg, green font
//																				"danger"			red bkg, white font
//																				"info"				cyan bkg, white font
//																				"normal"			black bkg, white font
//																				"primary"			blue bkg, white font
//																				"success"			green bkg, white font
//																				"warning"			yellow bkg, black font
//
//																				If omitted, the theme defaults to the
//																				"normal" theme.
//									(~string[]) styles		A list of strings as codes that apply
//																				font style effects to the text. The
//																				currently supported text style codes
//																				include:
//
//																				"bold"				Bolded Text
//																				"underline"		Underlined Text
//																				"reverse"			Inverted color text
//
//																				Multiple styles can be added at once.
//																				If omitted, no style is added to text.
// @returns				n/a
ColorLogger.log = function( message, options = {} ) {

	// Acquire theme customizations, if any
	var theme = typeof options.theme === "undefined" ? "normal" : options.theme;
	var decor = typeof options.style === "undefined" ? [] : options.style;

	// Acquire strings to append or prepend, if any
	var prepend = typeof options.prepend === "undefined" ? "" : options.prepend;
	var append = typeof options.append === "undefined" ? "" : options.append;

	// Define base colors (defaults to "primary" theme) and styles
	var fgColor = ColorLogger.colors.FgWhite;
	var bgColor = ColorLogger.colors.BgBlue;
	var fontStyle = "";

	// Make color changes by class, if necessary
	switch ( theme ) {
		case "complete": {
			fgColor = ColorLogger.colors.FgGreen;
			bgColor = ColorLogger.colors.BgBlack;
			break;
		}
		case "danger": {
			bgColor = ColorLogger.colors.BgRed;
			break;
		}
		case "info": {
			bgColor = ColorLogger.colors.BgCyan;
			break;
		}
		case "normal": {
			bgColor = ColorLogger.colors.BgBlack;
			break;
		}
		case "primary": {
			// do nothing; the primary color theme is already applied
			break;
		}
		case "success": {
			bgColor = ColorLogger.colors.BgGreen;
			break;
		}
		case "warning": {
			fgColor = ColorLogger.colors.FgBlack;
			bgColor = ColorLogger.colors.BgYellow;
			break;
		}
	}

	// Make style changes if necessary
	if ( decor.includes( "bold" ) ) {

		// If bolding is requested, add bolding
		fontStyle += styles.Bold;
	}
	if ( decor.includes( "underline" ) ) {

		// If underlining is requested, add underlines
		fontStyle += styles.Underline;
	}
	if ( decor.includes( "reverse" ) ) {

		// If color reversing is requested, add color reversing
		fontStyle += styles.Reverse;
	}

	// Compile the message into a template
	var template = `%s${fgColor}${bgColor}${fontStyle}%s${ColorLogger.colors.Reset}%s`;

	// Log to console
	console.log( template, prepend, message, append );
};
// END class ColorLogger

module.exports = ColorLogger;

// END colorLogger.js
