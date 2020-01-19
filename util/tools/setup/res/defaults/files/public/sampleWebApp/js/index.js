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

  createClock();
  // Insert additional post-load logic here...
};

// @function			createClock()
// @description		This function creates the clock GUI element using plain JS.
// @parameters		n/a
// @returns				n/a
function createClock() {

  // Create HTML clock element
  let clockElement = document.createElement( 'div' );
  clockElement.id = 'clock';
  clockElement.classList.add( 'clock' );

  // Create HTML clock tick elements
  let tickElement12 = document.createElement( 'div' );
  tickElement12.classList.add( 'clock-tick' );
  tickElement12.classList.add( 'tick-12' );

  let tickElement6 = document.createElement( 'div' );
  tickElement6.classList.add( 'clock-tick' );
  tickElement6.classList.add( 'tick-6' );

  let tickElement3 = document.createElement( 'div' );
  tickElement3.classList.add( 'clock-tick' );
  tickElement3.classList.add( 'tick-3' );

  let tickElement9 = document.createElement( 'div' );
  tickElement9.classList.add( 'clock-tick' );
  tickElement9.classList.add( 'tick-9' );

  // Create clock hands
  let secondHand = document.createElement( 'div' );
  secondHand.classList.add( 'clock-hand-second' );

  // // Create HTML clock spine element
  // let spine = document.createElement( 'div' );
  // spine.classList.add( 'clock-spine' );

  // Insert clock ticks into clock
  clockElement.appendChild( tickElement12 );
  clockElement.appendChild( tickElement6 );
  clockElement.appendChild( tickElement3 );
  clockElement.appendChild( tickElement9 );

  // Insert clock hands into clock
  clockElement.appendChild( secondHand );

  // Insert clock into the GUI
  document.getElementById( 'clock-container' ).appendChild( clockElement );
}

// BEGIN utility functions
// ...
// END utility functions