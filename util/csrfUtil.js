//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					csrfUtil.js
//	@Date Created:	2020-08-29
//	@Last Modified:	2020-08-29
//	@Details:
//									Defines utilities to apply CSRF protection to non-
//                  GET endpoints.
//	@Dependencies:
//									NPM csurf v1.11.0+

'use strict';

// Includes
const csrf = require( 'csurf' );
const opts = {
  cookie: {
    key: 'rjs2-csrf-token',
    secure: true,
    httpOnly: true,
    sameSite: true
  }
};

// BEGIN class CsrfUtil
// @class         CsrfUtil
// @description		This class defines CSRF protection utilities.
class CsrfUtil {

  // @ctor
  // @parameters		n/a
  constructor() {}

  // @function			getInstance()
  // @description		Gets the existing instance of the CSRF middleware,
  //                or creates and returns one if it doesn't exist yet.
  // @parameters		n/a
  // @returns				(function) func       The middleware function to use for
  //                                      protecting endpoints against CSRF
  //                                      attacks. On failure, throws an
  //                                      Exception.
  getInstance() {
    try {

      if( !CsrfUtil.instance ) {
        CsrfUtil.instance = csrf( opts );
      }
      return CsrfUtil.instance;
    } catch( exception ) {
      throw exception;
    }
  }

  // @function			spaInjectCsrf()????
  // @description		A utility function that embeds a CSRF token into a
  //                specific <meta> token within the target HTML file.
  // @parameters		(object) app          The express app/router to inject
  //                                      the CSRF form route under.
  // @returns				n/a
  // @notes         *It is VITAL that the page sends a request to the server
  //                asking for this token BEFORE any javascript runs. This
  //                means having a hidden <form> field placed as early as
  //                possible before any JS is rendered/loaded.
  spaInjectCsrf( app ) {
    try {
      
      if( !CsrfUtil.instance ) {
        CsrfUtil.instance = csrf( opts );
      }
    } catch( exception ) {
      throw exception;
    }
  }
}

// @property			instance
// @description		The middleware singleton instance
CsrfUtil.instance = false;
// END class CsrfUtil

module.exports = new CsrfUtil();

// END csrfUtil.js
