//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					index.js
//	@Date Created:	2020-01-19
//	@Last Modified:	2020-01-19
//	@Details:
//									Page logic for sampleWebApp
//	@Dependencies:
//									n/a

// @function			window.onload()
// @description		This function runs when the entire page and its resources have
//	              completed loading.
// @parameters		(Event) event         A reference to the DOM event that
//	                                    occurred.
// @returns				n/a
window.onload = ( event ) => {
  console.log( 'Completed loading of "sampleWebApp"' );

  // let clock = createClock();
  let clock = new Clock( document );

  // Insert clock into the GUI
  document.getElementById( 'clock-container' ).appendChild( clock.element );

  // Immediately set time and create interval
  clock.time = new Date( Date.now() );
  setInterval( () => {
    clock.time = new Date( Date.now() );
  }, 1000 );

  // Insert additional post-load logic here...
};

// BEGIN utility functions
// ...
// END utility functions