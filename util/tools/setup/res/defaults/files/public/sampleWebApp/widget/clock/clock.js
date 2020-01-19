//	@PROJECT:				rjs2
//	@Name:					R. Javier
//	@File:					clock.js
//	@Date Created:	2020-01-19
//	@Last Modified:	2020-01-19
//	@Details:
//									Defines a clock widget class in plain JS
//	@Dependencies:
//									n/a

// BEGIN class Clock
class Clock {

  // @ctor
  // @parameters		(Document) doc        A reference to the Document DOM Node
  //	              (~object) options     A set of options to configure how the
  //	                                    clock behaves. The following options
  //	                                    are supported:
  //	                (~string) id          The ID to give to the HTML element
  //	                                      representing this clock. If omitted,
  //	                                      no ID attribute value is given.
  constructor( doc, options = false ) {

    // Acquire parameters
    this.document = doc;
    this.gui = {
      clock: false,
      container: false,
      hand: {
        second: false,
        minute: false,
        hour: false
      },
      separator: {
        horizontal: false,
        vertical: false
      },
      tick: {
        horizontal: false,
        vertical: false
      },
      rotor: false
    };
    this.id = ( options && options.id ) ? options.id : false;

    // Create clock in specified document node
    this.create();
  }

  // @function			create()
  // @description		This function creates the clock GUI element within the given
  //	              document in plain JS.
  // @parameters		n/a
  // @returns				n/a
  create() {

    // Create and configure HTML clock element
    this.gui.container = document.createElement( 'div' );
    this.gui.container.classList.add( 'clock-container' );
    this.gui.clock = document.createElement( 'div' );
    if( this.id ) {
      this.gui.clock.id = this.id;
    }
    this.gui.clock.classList.add( 'clock' );

    // TODO: Implement default settings
    this.gui.container.style.setProperty( '--widget-clock-radius', '5em' );
    this.gui.container.style.setProperty( '--widget-clock-border-thickness', '2px' );
    this.gui.container.style.setProperty( '--widget-clock-diameter', 'calc( var( --widget-clock-radius ) * 2 )' );
    this.gui.container.style.setProperty( '--widget-clock-rotor-diameter', 'calc( var( --widget-clock-diameter ) / 4 )' );
    this.gui.container.style.setProperty( '--widget-clock-rotor-radius', 'calc( var( --widget-clock-rotor-diameter ) / 2 )' );
    this.gui.container.style.setProperty( '--widget-clock-tick-length', '2em' );
    this.gui.container.style.setProperty( '--widget-clock-tick-thickness', '5px' );

    // Create HTML 12 and 6 clock tick elements
    this.gui.tick.vertical = document.createElement( 'div' );
    this.gui.separator.vertical = document.createElement( 'div' );
    this.gui.tick.vertical.classList.add( 'clock-tick' );
    this.gui.tick.vertical.classList.add( 'vertical-axis' );
    this.gui.separator.vertical.classList.add( 'separator' );
    this.gui.tick.vertical.appendChild( this.gui.separator.vertical );

    // Create HTML 9 and 3 clock tick elements
    this.gui.tick.horizontal = document.createElement( 'div' );
    this.gui.separator.horizontal = document.createElement( 'div' );
    this.gui.tick.horizontal.classList.add( 'clock-tick' );
    this.gui.tick.horizontal.classList.add( 'horizontal-axis' );
    this.gui.separator.horizontal.classList.add( 'separator' );
    this.gui.tick.horizontal.appendChild( this.gui.separator.horizontal );

    // Create clock rotor
    this.gui.rotor = document.createElement( 'div' );
    this.gui.rotor.classList.add( 'clock-rotor' );

    // Create clock hands
    this.gui.hand.second = document.createElement( 'div' );
    this.gui.hand.second.classList.add( 'clock-hand' );
    this.gui.hand.second.classList.add( 'second' );
    this.gui.hand.minute = document.createElement( 'div' );
    this.gui.hand.minute.classList.add( 'clock-hand' );
    this.gui.hand.minute.classList.add( 'minute' );
    this.gui.hand.hour = document.createElement( 'div' );
    this.gui.hand.hour.classList.add( 'clock-hand' );
    this.gui.hand.hour.classList.add( 'hour' );

    // Insert component elements to clock GUI
    this.gui.clock.appendChild( this.gui.tick.vertical );
    this.gui.clock.appendChild( this.gui.tick.horizontal );
    this.gui.clock.appendChild( this.gui.rotor );
    this.gui.clock.appendChild( this.gui.hand.second );
    this.gui.clock.appendChild( this.gui.hand.minute );
    this.gui.clock.appendChild( this.gui.hand.hour );
    this.gui.container.appendChild( this.gui.clock );
  }

  // @function			element()
  // @description		This functions provides access to the widget's top-level GUI
  //                element.
  // @parameters		n/a
  // @returns				(Node) domNode        A reference to this widget's top-level
  //	                                    GUI element.
  get element() {
    // return this.gui.clock;
    return this.gui.container;
  }

  // @function			time()
  // @description		This function sets the time of the Clock object instance and
  //	              modifies the GUI to represent the given time.
  // @parameters		(Date) ts             The Date object whose time will be
  //	                                    represented.
  // @returns				n/a
  set time( ts ) {
    
    // Extract time elements from the given Date object
    let second = ts.getSeconds();
    let minute = ts.getMinutes();
    let hour = ts.getHours() % 12;

    // Update the hands to reflect the given time
    this.gui.hand.second.style.transform = `rotate(${ (second / 60) * 360 }deg)`;
    this.gui.hand.minute.style.transform = `rotate(${ (minute / 60) * 360 }deg)`;
    this.gui.hand.hour.style.transform = `rotate(${ (hour / 12) * 360 }deg)`;
  }
}
// END class Clock