//	@PROJECT: 		Core-v4
// 	@Name: 			[author]
// 	@File: 			[filename]
// 	@Date Created: 	[creationdate]
// 	@Last Modified: 	[moddate]
// 	@Details:
// 					[Description]
// 	@Dependencies:
// 					[Dependencies]

window.addEventListener( 'load', ( event ) => {
  alert( `I have loaded! ${JSON.stringify(event)}` );

  let body = document.getElementsByTagName("BODY")[0];
  console.log( 'body:', body );
  console.log( 'body.children:', body.children );
} );

// END [filename]
