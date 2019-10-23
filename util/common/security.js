//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					security.js
//	@Date Created:	2019-10-22
//	@Last Modified:	2019-10-22
//	@Details:
//									This file serves as the configuration file for various SSL-
//	                related settings. Used by the SslManager class.
//	@Dependencies:
//									n/a

'use strict';

// BEGIN Container (Singleton)
const security = {
  cert: '',
  chain: '',
};
Object.freeze( security );
// END Container (Singleton)

module.exports = security;

// END security.js
