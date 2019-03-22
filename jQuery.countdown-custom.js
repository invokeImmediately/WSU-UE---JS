/*!*************************************************************************************************
 * jQuery.countdown-custom.js 
 * -------------------------------------------------------------------------------------------------
 * DESCRIPTION: Application of "The Final Countdown" jQuery plugin, written by Edson Hilios, to WSU
 *   OUE websites. (Please see https://github.com/hilios/jQuery.countdown for Edson's repository for
 *   "The Final Countdown.")
 *
 * AUTHOR: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 *
 * REPOSITORY: https://github.com/invokeImmediately/WSU-UE---JS
 *
 * LICENSE: ISC - Copyright (c) 2019 Daniel C. Rieck.
 *
 *   Permission to use, copy, modify, and/or distribute this software for any purpose with or
 *   without fee is hereby granted, provided that the above copyright notice and this permission
 *   notice appear in all copies.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS" AND DANIEL RIECK DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
 *   SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL
 *   DANIEL RIECK BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY
 *   DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF
 *   CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *   PERFORMANCE OF THIS SOFTWARE.
 **************************************************************************************************/

////////////////////////////////////////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS
// -----------------
//   §1: Modules used to initialize countdown timers...........................................43
//      §1.1: CountdownTimerSelectors class....................................................46
//   §2: Initilization of countdown timers....................................................172
//      §2.1: Document-ready execution sequence...............................................182
//      §2.2: Window-loaded execution sequence................................................190
//      §2.3: Class definitions...............................................................198
//         §2.3.1: Private properties.........................................................210
//         §2.3.2: Public properties..........................................................217
//         §2.3.3: Main constructor execution sequence........................................224
//         §2.3.4: Private function definitions...............................................232
//      §2.3: Function definitions............................................................439
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: Modules for initializing countdown timers

////////
// §1.1: CountdownTimerSelectors class

/**
 * Module for storing validated settings for OUE countdown timers designed to be functionalized via
 * jQuery class selectors.
 *
 * @class
 */

var CountdownTimerSelectors = ( function( $, thisFile ) {

	'use strict';
	/**
	 * Validated settings for OUE countdown timers designed to be functionalized via jQuery class
	 * selectors.
	 *
	 * @param {string} timer - Class-based selector for isolating countdown timer elements.
	 * @param {string} container - Class-based selector for obtaining the container component of a
	 *     countdown timer.
	 * @param {string} message -  Class-based selector targeting the message component of a countdown
	 *     timer.
	 * @param {string} prependedHtml - Class-based selector for isolating the component of a countdown
	 *     timer that contains HTML to be prepended to the inner HTML of the message.
	 * @param {string} appendedHtml - Class-based selector for isolating the component of a countdown
	 *     timer that contains HTML to be appended to the inner HTML of the message.
	 *
	 * @throws {object} If the type of any argument is invalid and/or an argument is not a properly
	 *     formatted class selector, an object will be thrown containing four string-typed parameters:
	 *     fileName, fName, fDesc, and errorMsg. The thrown object is thus meant to be utilized with the
	 *     jQuery.logError function.
	 */
	function CountdownTimerSelectors( timer, container, message, prependedHtml, appendedHtml ) {
		////////////////////////////////////////////////////////////////////////////////////////////
		// PUBLIC PROPERTIES

		this.timer = timer;
		this.container = container;
		this.message = message;
		this.prependedHtml = prependedHtml;
		this.prependedHtml = appendedHtml;

		this.argTypeMask = 0;
		this.validSelectorMask = 0;
		this.validSelectorNeedle = /\.[a-zA-Z0-9\-_]+$/;

		////////////////////////////////////////////////////////////////////////////////////////////
		// MAIN CONSTRUCTOR EXECUTION

		this.validate();
	}

	CountdownTimerSelectors.prototype.validate = function () {
		initErrorMessages(this);
		checkArgTypes(this);
		checkSelectorStructure(this);
		throwAnyErrors(this);		
	}

	////////////////////////////////////////////////////////////////////////////////////////////
	// PRIVATE FUNCTION DEFINITIONS

	/**
	 *
	 */
	function checkArgTypes( obj ) {
		obj.argTypeMask = typeof obj.timer === 'string';
		obj.argTypeMask = ( obj.argTypeMask << 1 ) | typeof obj.container === 'string';
		obj.argTypeMask = ( obj.argTypeMask << 1 ) | typeof obj.message === 'string';
		obj.argTypeMask = ( obj.argTypeMask << 1 ) | typeof obj.prependedHtml === 'string';
		obj.argTypeMask = ( obj.argTypeMask << 1 ) | typeof obj.appendedHtml === 'string';
	}

	/**
	 *
	 */
	function checkSelectorStructure( obj ) {
		obj.validSelectorMask = !!obj.validSelectorNeedle.exec( obj.timer );
		obj.validSelectorMask = ( obj.validSelectorMask << 1 ) |
			!!obj.validSelectorNeedle.exec( obj.container );
		obj.validSelectorMask = ( obj.validSelectorMask << 1 ) |
			!!obj.validSelectorNeedle.exec( obj.message );
		obj.validSelectorMask = ( obj.validSelectorMask << 1 ) |
			!!obj.validSelectorNeedle.exec( obj.prependedHtml );
		obj.validSelectorMask = ( obj.validSelectorMask << 1 ) |
			!!obj.validSelectorNeedle.exec( obj.appendedHtml );
	}

	function initErrorMessages( obj ) {
		try {
			obj.error = {
				fileName: thisFile,
				fName: 'CountdownTimerSelectors',
				fDesc: 'Validated settings for class-based OUE countdown timers.',
				errorMsg: ''
			};
		} catch ( e ) {
			obj.error = {
				fileName: 'Unidentified file',
				fName: 'CountdownTimerSelectors',
				fDesc: 'Validated settings for class-based OUE countdown timers.',
				errorMsg: ''
			};
		}
	}

	function throwAnyErrors( obj ) {
		if ( !obj.argTypeMask || !obj.validSelectorMask ) {
			if ( !obj.argTypeMask ) {
				obj.error.errorMsg = 'I encountered a wrongly typed argument during construction.';
				if ( !obj.validSelectorMask ) {
					obj.error.errorMsg += ' Also, ';
				}
			}
			if ( !obj.validSelectorMask ) {
				obj.error.errorMsg += 'I found that at least one of my arguments did not contain a \
properly formed class selector as required.';
			}
			throw obj.error;
		}
	}

	return CountdownTimerSelectors;

} )( jQuery, 'jQuery.countdown-custom.js' );

////////////////////////////////////////////////////////////////////////////////////////////////////
// §2: Initialization of countdown timers

( function ( $ ) {

var $countdownTimerById;
var $countdownTimersByClass;
var animationTiming = 400;	// Controls the speed at which jQuery-induced countdown animations occur
var thisFileName = 'jQuery.countdown-custom';

////////
// §2.1: Document-ready execution sequence

$( function () {
	$countdownTimerById = processCountdownTimerById( '#countdown-clock' );
	// TODO: $countdownTimersByClass = processCountdownTimersByClass( … );
} );

////////
// §2.2: Window-loaded execution sequence

$( window ).on( 'load', function () {
	showIdSelectedCountdownTimer( $countdownTimerById, animationTiming );
	// TODO: showClassSelectedCountdownTimers( $countdownTimersByClass );
} );

////////
// §2.3: Class definitions

/**
 * Collection of jQuery objects that represent the components of a single countdown timer.
 *
 * @param {CountdownTimerSelectors} selectors - Collection of class selectors for isolating
 *     countdown timer components.
 *
 * TODO: @throws {?} ?
 */
function CountdownTimerObjs( selectors ) {
	////////
	// §2.3.1: Private properties

	var _argTypeMask = 0;
	var _objFoundMask = undefined;
	var _error;

	////////
	// §2.3.2:  Public properties

	this.selectors = undefined;
	this.$timers = undefined;
	this.timerComponents = undefined;

	////////
	// §2.3.3: Main constructor execution sequence

	_initErrorMessages();
	_checkArgType();
	_findJQueryObjs();
	_throwAnyErrors();

	////////
	// §2.3.4: Private function definitions

	function _checkArgTypes() {
		_argTypeMask = selectors instanceof CountdownTimerSelectors;
		if ( _argTypeMask ) {
			this.selectors = selectors;
		}
	}

	/**
	 * Find the appended HTML component element associated with a previously selected countdown
	 * timer element.
	 *
	 * It is assumed that the appended HTML component should be a child element of the timer.
	 *
	 * @param {jQuery} $timer - The previously selected timer element.
	 * @param {string} selector - Class-based selector for the timer's appended HTML component.
	 *
	 * @return {(jQuery|undefined)} Either a jQuery object representing the appended HTML component
	 *     or undefined if nothing was found.
	 */
	function _findAppendedHtml( $timer, selector ) {
		var $obj;

		// Step[0]: Look for the appended HTML component among the children of the timer
		// element.
		$obj = $timer.find( selector );
		if ( !$obj.length ) {
			// Step[1]: No appended HTML component was found, ∴ return undefined instead of
			// empty jQuery object.
			$obj = undefined;
		}

		return $obj;
	}

	/**
	 * Find the container component element associated with a previously selected countdown timer
	 * element.
	 *
	 * It is assumed that the container component should either be the same element as the timer or
	 * a child of it.
	 *
	 * @param {jQuery} $timer - The previously selected timer element.
	 * @param {string} selector - Class-based selector for the timer's container component.
	 *
	 * @return {(jQuery|undefined)} Either a jQuery object representing the container component or
	 *     undefined if nothing was found.
	 */
	function _findContainer( $timer, selector ) {
		var $obj;

		// Step[0]: First check the originally selected timer element to see if it is also the
		// container.
		if ( $timer.hasClass( selector ) ) {
			$obj = $timer;
		} else {
			// Step[1]: Now try looking for the container among the children of the timer element.
			$obj = $timer.find( selector );
			if ( !$obj.length ) {
				// Step[2]: No container was found, ∴ return undefined instead of empty jQuery
				// object.
				$obj = undefined;
			}
		}

		return $obj;
	}

	/**
	 * Find all countdown timer elements within the document, along with their components, using the
	 * selectors specified during construction.
	 */
	// TODO: Finish writing function.
	function _findJQueryObjs() {
		var $timer_i;
		var components_i = {
			$timer: undefined,
			$container: undefined,
			$message: undefined,
			$prependedHtml: undefined,
			$appendedHtml: undefined
		}
		var timerComponents;

		if ( _argTypeMask ) {
			timerComponents = [];
			this.$timers = $( selectors.timer );
			this.$timers.each( function() {
				components_i.$timer = $timer_i = $( this );
				components_i.$container = _findContainer( $timer_i, selectors.container );
				components_i.$message = _findMessage( $timer_i, selectors.message );
				components_i.$prependedHtml = _findPrependedHtml( $timer_i,
					selectors.prependedHtml );
				components_i.$appendedHtml = _findAppendedHtml( $timer_i, selectors.appendedHtml );
				timerComponents.push( components_i );
			} );
			this.timerComponents = timerComponents;

			// TODO: Set _objFoundMask based on results.
/*TODO*/			_validateFoundObjects();
		}
	}

	/**
	 * Find the message component element associated with a previously selected countdown timer
	 * element.
	 *
	 * It is assumed that the message component should be a child element of the timer.
	 *
	 * @param {jQuery} $timer - The previously selected timer element.
	 * @param {string} selector - Class-based selector for the timer's message component.
	 *
	 * @return {(jQuery|undefined)} Either a jQuery object representing the message component or
	 *     undefined if nothing was found.
	 */
	function _findMessage( $timer, selector ) {
		var $obj;

		// Step[0]: Look for the message component among the children of the timer element.
		$obj = $timer.find( selector );
		if ( !$obj.length ) {
			// Step[1]: No message component was found, ∴ return undefined instead of empty
			// jQuery object.
			$obj = undefined;
		}
		// …

		return $obj;
	}

	/**
	 * Find the prepended HTML component element associated with a previously selected countdown
	 * timer element.
	 *
	 * It is assumed that the prepended HTML component should be a child element of the timer.
	 *
	 * @param {jQuery} $timer - The previously selected timer element.
	 * @param {string} selector - Class-based selector for the timer's prepended HTML component.
	 *
	 * @return {(jQuery|undefined)} Either a jQuery object representing the prepended HTML component
	 *     or undefined if nothing was found.
	 */
	function _findPrependedHtml( $timer, selector ) {
		var $obj;

		// Step[0]: Look for the prepended HTML component among the children of the timer
		// element.
		$obj = $timer.find( selector );
		if ( !$obj.length ) {
			// Step[1]: No prepended HTML component was found, ∴ return undefined instead of
			// empty jQuery object.
			$obj = undefined;
		}


		return $obj;
	}

	/**
	 * Set default values for the private member that internally tracks errors.
	 */
	function _initErrorMessages() {
		try {
			_error = {
				fileName: thisFileName,
				fName: 'CountdownTimerObjs',
				fDesc: 'Collection of jQuery objects that represent countdown timer elements and th\
eir components.',
				errorMsg: ''
			};
		} catch ( e ) {
			_error = {
				fileName: 'Unidentified file',
				fName: 'CountdownTimerObjs',
				fDesc: 'Collection of jQuery objects that represent countdown timer elements and th\
eir components.',
				errorMsg: ''
			};
		}
	}

	// TODO: Copied from CountdownTimerSelectors; rewrite.
	function _throwAnyErrors() {
		if ( !argTypeMask || !validSelectorMask ) {
			if ( !argTypeMask ) {
				_error.errorMsg = 'I encountered a wrongly typed argument during construction.';
				if ( !validSelectorMask ) {
					_error.errorMsg += ' Also, ';
				}
			}
			if ( !validSelectorMask ) {
				_error.errorMsg += 'I found that at least one of my arguments did not contain a pro\
perly formed class selector as required.';
			}
			throw _error;
		}
	}

	function _validateFoundObjects() {
		var timerComponents;
	}
}

////////
// §2.4: Function definitions

/**
 * Find and process a countdown timer element that has been marked with the ID attribute.
 *
 * @param {CountdownTimerSelectors} selectors - Selectors necessary for isolating and initializing
 *     the countdown timer.
 */
function processCountdownTimersByClass( selectors ) {
	var $components;
	var error = {
		fileName: thisFileName,
		fName: 'processCountdownTimersByClass',
		fDesc: 'Find and process a countdown timer element that has been marked with an ID attribut\
e.',
		msg: ''
	};

	try {
		if (selectors instanceof CountdownTimerSelectors) {
			// TODO: Get components.
		} else {
			error.msg = 'I was passed an invalidly typed argument.';
			throw error;
		}
	} catch ( thrownError ) {
		$.logError( thrownError.fileName, thrownError.fName, thrownError.fDesc, thrownError.msg );
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// SUB FUNCTIONS
// TODO:
//	function …( … ) {
//		…
//	}
}

/**
 * Find and process a countdown timer element that has been marked with the ID attribute.
 * 
 * @param {string} selectorStr - Selector string for isolating countdown timer elements within the
 *     DOM.
 *
 * @return {(undefined|jQuery)} Either a jQuery object representing the element identified by ID as
 *     a countdown timer or undefined if an error condition was encountered.
 */
function processCountdownTimerById( selectorStr ) {
	var $countdownClockById = undefined;
	var argIsIdSelector;
	var errMsg;
	var error = {
		fileName: thisFileName,
		fName: 'processCountdownTimerById',
		fDesc: 'Find and process a countdown timer element that has been marked with an ID attribut\
e.',
		msg: ''
	};
	var validArgType;

	validArgType = typeof selectorStr === 'string';
	argIsIdSelector = validArgType ?
		( /^#/ ).exec( selectorStr ) :
		false;
	try {
		if ( validArgType && argIsIdSelector ) {
			$countdownClockById = $( selectorStr );
			if ( $countdownClockById.length === 1 ) {
				processCountdownTimerMsg( $countdownClock );
			} else if ( $countdownClockById.length > 1 ) {
				error.msg = 'I found ' + ($countdownClockById.length).toString() + ' instead of the\
 required 1 ID-labeled countdown timers.'
				throw error;
			}
		} else {
			if ( validArgType ) {
				error.msg += 'I was passed a selector string argument that was typed as ' +
					( typeof selectorStr ) + ' instead of string.';
			}
			if ( argIsIdSelector ) {
				if ( validArgType ) {
					error.msg += ' Also, '
				}
				error.msg += 'I was passed a selector string argument that did not contain a simple \
ID-based selector.';
			}
			throw error;
		}
	} catch ( thrownError ) {
		$.logError( thrownError.fileName, thrownError.fName, thrownError.fDesc, thrownError.msg );
	}

	return $countdownClockById;
}

/**
 *  Invokes the "The Final Countdown" jQuery plugin on appropriate elements within the DOM.
 *  
 *  @param {jQuery} $countdownTimer - A single jQuery object containing an element on which the
 *      plugin will be invoked.
 */
function processCountdownTimerMsg ( $countdownTimerMsg ) {
	var countdownTarget;
	var expiredMsg;
	var fnctnDesc = 'Invokes the "The Final Countdown" jQuery plugin on appropriate elements within\
 the DOM.';
	var fnctnName = 'processCountdownTimer';
	var format;
	var parsedMsg;
	var pendingMsg;

	// Check integrity of argument
	if ( $.isJQueryObj( $countdownTimerMsg ) ) {
		// Invoke The Final Countdown plugin on the object after parsing the necessary data.
		countdownTarget = $countdownTimerMsg.data( 'countdown' );

		// TODO: Add appending and prepending of message strings
		pendingMsg = $countdownTimerMsg.data( 'pending-message' );
		expiredMsg = $countdownTimerMsg.data( 'expired-message' );
		// TODO: Refactor this function for improved performance:
		// * Parse the messages only once
		// * Add spans as children to the element and label them with identifying classes
		// * Update the html of only the countdown span each clock cycle
		if ( countdownTarget && pendingMsg && expiredMsg ) {
			$countdownTimerMsg.countdown( countdownTarget ).on( 'update.countdown', 
					function( event ) {
				parsedMsg = pendingMsg.replace( /\[/g, '<' ).replace( /\]/g, '>' );
				format = '%H:%M:%S';
				if ( event.offset.totalDays > 0 ) {
					format = '%-D day%!D and ' + format;
				}
				format = '<strong>' + format + '</strong>' + parsedMsg;
				$( this ).html( event.strftime( format ) );
			} ).on( 'finish.countdown', function( event ) {
				parsedMsg = expiredMsg.replace( /\[/g, '<' ).replace( /\]/g, '>' );
				$( this ).html( parsedMsg );
			} );
		} else {
			// TODO: Expand error reporting to achieve optimal granularity for troubleshooting.
			$.logError( thisFileName, fnctnName, fnctnDesc,
				'Because I encountered a problem with expected data attributes, I am unable to proc\
eed with invocation of The Final Countdown on the jQuery object I am currently working with.\n\tHer\
e\'s information on the variables I am handling:'
			);
			console.log( $countdownTimerMsg, pendingMsg, expiredMsg );
		}
	} else {
		$.logError( thisFileName, fnctnName, fnctnDesc,
			'I was passed an invalid argument for $countdownTimerMsg, which appears below:'
		);
		console.log( $countdownTimerMsg );
	}
}

/**
 * Find and process countdown timer elements whose components have been marked with the class
 * attribute.
 * 
 * @param {string} selectorStr - Selector string for isolating countdown timer elements within the
 *     DOM.
 *
 * @return {(undefined|jQuery)} Either a jQuery object representing the elements identified by class
 *     as countdown timers or undefined if an error condition was encountered.
 */
// TODO: function processCountdownTimersByClass( … ) { … }

/**
 * Show a countdown timer that was marked by its ID attribute.
 *
 * @param {undefined|jQuery} $countdownClock - Either a jQuery object representing the element
 *     identified by ID as a countdown timer or undefined if no such element was found.
 * @param {number} animationTiming - The duration of the show animation in milliseconds.
 */
function showIdSelectedCountdownTimer( $countdownClock, animationTiming ) {
	var $countdownParent;
	var hideCountdown = false;
	var validArgTypes = {};
	var error = {
		fileName: thisFileName,
		fName: 'showIdSelectedCountdownTimer',
		fDesc: 'Show a countdown timer that was marked by its ID attribute.',
		msg: ''
	};

//	var hideUntilTime = $countdownClock.data( 'hide-until' );
//	var showUntilTime = $countdownClock.data( 'show-until' );

	//TODO: Implement showing/hiding times for countdown timers.
	try {
		validArgTypes[ '$countdownClock' ] = $.isJQueryObj( $countdownClock );
		validArgTypes[ 'animationTiming' ] = typeof animationTiming === 'number';
		if ( $countdownClock && validArgTypes [ '$countdownClock' ] &&
				validArgTypes[ 'animationTiming' ] ) {
			$countdownParent = $countdownClock.parents( 'section' ).first();
			if ( !hideCountdown ) {
				$countdownParent.show( animationTiming );
			}
		} else {
			if ( $countdownClock ) {
				if ( !validArgTypes[ '$countdownClock' ] ) {
					error.msg = 'I was passed a purported jQuery object representing the countdown \
timer, but it turned out to not actually be a jQuery object.';
				}
				if ( !validArgTypes[ 'animationTiming' ] ) {
					if ( error.msg == '' ) {
						error.msg += ' Also, ';
					}
					error.msg += 'I was passed a non-number argument for the show animation timing \
that turned out to be typed as ' + ( typeof animationTiming ) +  '.';
				}
				throw error;
			}
		}
	} catch ( thrownError ) {
		$.logError( thrownError.fileName, thrownError.fName, thrownError.fDesc, thrownError.msg );
	}
}

} )( jQuery );
