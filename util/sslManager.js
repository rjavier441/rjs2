//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					sslManager.js
//	@Date Created:	2019-10-21
//	@Last Modified:	2019-10-21
//	@Details:
//									Defines a SSL User Agent Manager for use in all ssl/https
//	                transactions.
//	@Dependencies:
//									NodeJS v8+

'use strict';
var fs = require( 'fs' );
var settings = require( './settings.js' );

// BEGIN class SslManager
class SslManager{

  // @ctor
  // @parameters		(object) options    An object containing any of the
  //	                                  following keys to configure SSL:
  //	                (string) cert       Full path to the CA certificate in PEM
  //	                                    format. If omitted, this defaults to
  //	                                    false.
  //	                (~string) chain     Full path to the CA authentication
  //	                                    chain file, which overrides the
  //	                                    default chain of trusted CAs (read
  //	                                    NodeJS documentation for the method
  //	                                    'tls.createSecureContext()'). If
  //	                                    omitted, this defaults to false.
  //	                (~string) pass      The optional 'prvkey' passphrase. If
  //	                                    omitted, this defaults to false.
  //	                (~string) prvkey    Full path to the private key file. If
  //	                                    omitted, this defaults to false.
  //	                (~string) pubkey    Full path to the public key file. If
  //	                                    omitted, this defaults to false.
  // @note            TODO: Depending on the context, SslManager can use either
  //	                self-signed certificates or official CA certificates.
  //	                If 'cert' and 'chain' are provided, the SslManager assumes
  //	                you are using an official CA Certificate which is verified
  //	                by the CA(s) described by the CA chain file 'chain'. If
  //	                'cert' is provided along with both 'prvkey' and 'pubkey',
  //	                use of a self-signed certificate is assumed.
  constructor( options ) {
    this.privateKey = _lib.Util.isset( options.prvkey ) ?
      fs.readFileSync( options.prvkey, 'utf8' ) : false;
    this.publicKey = _lib.Util.isset( options.pubkey ) ?
      fs.readFileSync( options.pubkey, 'utf8' ) : false;
    this.caCertificate = _lib.Util.isset( options.cert ) ?
      fs.readFileSync( options.cert, 'utf8' ) : false;
    this.caChain = _lib.Util.isset( options.chain ) ?
      fs.readFileSync( options.chain, 'utf8' ) : false;
    this.passphrase = _lib.Util.isset( options.pass ) ? options.pass : false;

    // Create user agent for SSL/HTTPS APIs
    this.sslUserAgent = new https.Agent( {
      'port': _lib.settings.port,
      'ca': this.caCertificate
    } );
  }

  // @function			serverContext()
  // @description		Provides access to a suite of server settings that control
  //	              and tune the secure behavior of the server's transactions.
  // @parameters		n/a
  // @returns				(object) ctx        The server context settings for all Node
  //	                                  SSL/HTTPS transactions between clients
  //	                                  and the server.
  // @note          See NodeJS's 'https.createServer()' documentation for more
  //	              details on server SSL/HTTPS configuration settings.
  get serverContext() {
    var ctx = {};

    if( this.privateKey ) {
      ctx.key = this.privateKey;
    }
    if( this.caCertificate ) {
      ctx.cert = this.caCertificate;
    }
    if( this.caChain ) {
      ctx.ca = this.caChain;
    }
    if( this.passphrase ) {
      ctx.passphrase = this.passphrase;
    }

    // Custom options
    ctx.requestCert = false;          // If true, clients will be verified via
                                      // CA cert.
    ctx.rejectUnauthorized = false;   // Accept all traffic.

    return ctx;
  }

  // @function			userAgent()
  // @description		Provides access to the SSL User Agent produced by the
  //	              SslManager instance.
  // @parameters		n/a
  // @returns				(object) ua         The user agent object to facilitate SSL
  //	                                  and HTTPS web exchanges.
  get userAgent() {
    return this.sslUserAgent;
  }
}
// END class SslManager

// Container (Singleton)
// TODO: Create ssl json file containing all req'd params for SslManager ctor
const instance = new SslManager( fs.readFileSync( _lib.settings.ssl, 'utf8' ) );
Object.freeze( instance );
module.exports = instance;

// END sslManager.js
