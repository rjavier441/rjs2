//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					configSecurity.js
//	@Date Created:	2019-11-28
//	@Last Modified:	2019-11-28
//	@Details:
//									Defines a script that configures security.json.
//	@Dependencies:
//									n/a

'use strict';

// BEGIN includes
const _lib = require( '../../../../_lib_optin.js' )._optin( [
  'settings',
  'ColorLogger'
] );
const fs = require( 'fs' );
const readline = require( 'readline' );
// END includes

// @function      script()
// @description   This function defines the script to run.
// @parameters    (function) resolve    The resolve function passed to a JS
//                                      Promise function.
//                (function) reject     The reject function passed to a JS
//                                      Promise function.
// @returns       n/a
function script( resolve, reject ) {

  var output = {};
  const rl = readline.createInterface( {
    input: process.stdin,
    output: process.stdout,
  } );

  _lib.ColorLogger.log( 'Configuring security.json', {
    theme: 'primary',
    style: ['bold']
  } );

  // Define starting promise to a promise chain for server security config
  var promise = new Promise( ( pass, fail ) => {

    var question = 'The RJS2 server can be run using standard HTTP (insecure) ';
    question += 'or HTTPS (secure). However, use of HTTPS requires the server ';
    question += 'to know where to access Public Key Infrastructure files ';
    question += '(i.e. CA Certificates, private key files, etc.).\n';
    
    // Check for any currently set security file
    if(
      fs.existsSync( `${_lib.settings.util}/common/security/security.json` )
    ) {
      question += 'It appears you already have security settings configured.\n';
      question += 'Would you like to overwrite those settings? (Y/n): ';
    } else {
      question += 'Would you like to configure those settings now? (Y/n): ';
    }

    try{

      rl.question( question, ( answer ) => {
    
        if( answer.toLowerCase() === 'y' ) {
          pass( true );
        } else {
          pass( false );
        }        
      } );
    } catch( exception ) {
      
      // Fail and close stream to avoid recurring read stream creation.
      rl.close();
      fail( exception );
    }
  } );

  // Create promise to acquire cert location
  promise.then( ( okToSetupSecurity ) => {

    // Check if user approves security configuration
    if( okToSetupSecurity ) {
      return new Promise( ( pass, fail ) => {
        try {
          rl.question(
            'Enter the full path of your CA Certificate (.crt/.pem):\n',
            ( answer ) => {
              output.cert = answer.length > 0 ? answer : false;
              pass( true );
            }
          );
        } catch( exception ) {
          fail( exception );
          rl.close();
        }
      } );
    } else {

      // End chain by returning false to the next promise
      return false;
    }
  } )

  // Create promise to acquire cert key chain (if available)
  .then( ( okToGetChain ) => {
    if( okToGetChain ) {
      return new Promise( ( pass, fail ) => {
        try {
          rl.question(
            'Enter the full path of your CA certificate chain (or leave ' +
            'blank if none exists!):\n',
            ( answer ) => {
              output.chain = answer.length > 0 ? answer : false;
              pass( true );
            }
          );
        } catch( exception ) {
          fail( exception );
          rl.close();
        }
      } );
    } else {

      // End chain...
      return false;
    }
  } )

  // Create promise to acquire cert private key (if available)
  .then( ( okToGetPrivateKey ) => {
    if( okToGetPrivateKey ) {
      return new Promise( ( pass, fail ) => {
        try {
          rl.question(
            'Enter the full path of your cert private key file (or leave ' +
            'blank if none exists!):\n',
            ( answer ) => {
              output.prvkey = answer.length > 0 ? answer : false;
              pass( true );
            }
          );
        } catch( exception ) {
          fail( exception );
          rl.close();
        }
      } );
    } else {

      // End chain...
      return false;
    }
  } )

  // Create promise to acquire cert public key (if available)
  .then( ( okToGetPublicKey ) => {
    if( okToGetPublicKey ) {
      return new Promise( ( pass, fail ) => {
        try {
          rl.question(
            'Enter the full path of your cert public key file (or leave ' +
            'blank if none exists!):\n',
            ( answer ) => {
              output.pubkey = answer.length > 0 ? answer : false;
              pass( true );
            }
          );
        } catch( exception ) {
          fail( exception );
          rl.close();
        }
      } );
    } else {

      // End chain...
      return false;
    }
  } )

  // Create promise to acquire key passphrase (if available)
  .then( ( okToGetPassphrase ) => {
    if( okToGetPassphrase ) {
      return new Promise( ( pass, fail ) => {
        try {
          rl.question(
            'Enter the passphrase to your private key file (or leave blank ' +
            'if none exists or you did not specify a private key file!):\n',
            ( answer ) => {
              output.pass = answer.length > 0 ? answer : false;
              pass( true );
            }
          );
        } catch( exception ) {
          fail( exception );
          rl.close();
        }
      } );
    } else {

      // End chain...
      return false;
    }
  } )

  // Create promise to review the configuration with the user before submission
  .then( ( okToReviewResults ) => {
    if( okToReviewResults ) {
      return new Promise( ( pass, fail ) => {
        try {
          var prettySecurityJson = JSON.stringify( output, null, 4 );
          rl.question(
            `Security Configuration:\n\n${prettySecurityJson}\n\n` +
            'Is this ok? (Y/n): ',
            ( answer ) => {
              if( answer.toLowerCase() === 'y' ) {
                pass( true );
              } else {
                pass( false );
              }
            }
          );
        } catch( exception ) {
          fail( exception );
          rl.close();
        }
      } );
    } else {

      // End chain...
      return false;
    }
  } )

  // Create promise to save the configuration with the user's permission
  .then( ( okToSaveConfiguration ) => {
    if( okToSaveConfiguration ) {
      return new Promise( ( pass, fail ) => {
        try {
          _lib.ColorLogger.log( `Saving configuration...` );
          var prettySecurityJson = JSON.stringify( output, null, 4 );
          fs.writeFileSync(
            `${_lib.settings.util}/common/security/security.json`,
            prettySecurityJson,
            { encoding: 'utf8' }
          );
          pass();
          resolve();
          rl.close();
        } catch( exception ) {
          fail( exception );
          rl.close();
        }
      } );
    } else {

      // End chain...
      rl.close();
      resolve();
      return false;
    }
  } )

  // Handle any errors
  .catch( ( error ) => {
    _lib.ColorLogger.log( `Error: ${error}`, { theme: 'failure' } );
    resolve();
    rl.close();
  } );
}

module.exports = { script };

// END configSecurity.js
