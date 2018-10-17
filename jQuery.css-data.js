/*!
 * jQuery.css-data.js
 * -------------------------------------------------------------------------------------------------
 * SUMMARY: Declares the CssData class for use on OUE websites.
 *
 * DESCRIPTION: Provides 
 *
 * AUTHOR: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 *
 * REPOSITORY: https://github.com/invokeImmediately/WSU-UE---JS
 *
 * LICENSE: ISC - Copyright (c) 2018 Daniel C. Rieck.
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
 */

var CssData = ( function ($) {

var thisFile = 'jQuery.css-data.js';

/**
 * Interface for interpreting CSS class names as information encodings.
 *
 * @param {object} $obj - A jQuery object containing a single element with data encoded in one or
 *     more of its CSS class names.
 */
function CssData($obj) {
	////////////////////////////////////////////////////////////////////////////////////////////////
	// PRIVATE PROPERTIES
	var _$obj = $obj;
	var _argsAreValid = false;
	var _classList = undefined;
	var _masterPrefix = 'data-';

	////////////////////////////////////////////////////////////////////////////////////////////////
	// CONSTRUCTOR EXECUTION SECTION
	_ValidateArgs();
	_LoadClassList();

	////////////////////////////////////////////////////////////////////////////////////////////////
	// PROTECTED METHODS

	/**
	 * Returns data embedded in an object's CSS class name based on an indicator prefix.
	 *
	 * @param {string} dataPrefix - String representing the prefix string that marks a CSS class as
	 *     an encoding of data (e.g., 'expires-on-').
	 *
	 * @throws {string} Parameter dataPrefix must typed as a string.
	 *
	 * @return {string} Returns any data encoded within the CSS class list. If no valid data was
	 *     found, returns an empty string.
	 */
	this.getData = function (dataPrefix) {
		// TODO: Finish writing function.
		var data = '';
		var idx;
		var class_i;
		var reObj;
		var matchResult;
		if ( typeof dataPrefix === 'string' ) {
			reObj = new RegExp( '^' + _masterPrefix + dataPrefix + '-(.*)$' );
			for ( idx = 0; !matchResult && idx < _classList.length; idx++ ) {
				class_i = _classList.item(idx);
				matchResult = reObj.exec( class_i );
			}
			if ( matchResult !== null ) {
				if (matchResult.length === 2) {
					data = matchResult[1];
				}
			}
			// TODO: Handle additional error states.
		} else {
			throw 'I was expecting to be passed a string for my dataPrefix parameter; instead, I wa\
s passed something that was typeof ' + typeof dataPrefix + '.';
			// TODO: Write & apply OueError class.
//			throw new OueError( thisFile, 'CssData.GetData(…)', 'I was expecting to be passed a str\
//ing for my dataPrefix parameter; instead, I was passed something that was typeof ' +
//				typeof dataPrefix + '.', dataPrefix );
		}
		return data;
	}

	////////////////////////////////////////////////////////////////////////////////////////////////
	// PRIVATE METHODS

	/**
	 * Get a reference to the class list for the jQuery object this instance is associated with.
	 *
	 * @access private
	 */
	function _LoadClassList() {
		if ( _argsAreValid ) {
			_classList = _$obj[0].classList;
		}
	}

	/**
	 * Provides the user with information about any errors encountered during construction of this
	 * instance.
	 *
	 * @access private
	 *
	 * @param {number} constructorErrorMask - A bitmask wherein each bit flags whether the error
	 *     stored in the accompanying error message array was encountered.
	 * @param {string[]} errorMsgs - An array of error messages that explain the errors flagged by
	 *     the bitmask parameter.
	 *
	 * @throws {string} A console-ready error message is thrown by this function if any errors were
	 *     encountered during the construction of this instance.
	 */
	function _ReportConstructorErrors(constructorErrorMask, errorMsgs) {
		var i;
		var errorMsg;

		if ( !_argsAreValid ) {
			errorMsg = 'This is an error report from an instance of CssData. I encountered the foll\
owing problems during my construction:';
			for ( i = 0; i < errorMsgs.length; i++ ) {
				if ( 1 & ( constructorErrorMask >> i ) ) {
					errorMsg += '\n' + errorMsgs[ i ];
				}
			}
			throw errorMsg;
		}
	}

	/**
	 * Ensures the arguments passed to this instance during its construction are valid.
	 *
	 * @access private
	 */
	function _ValidateArgs() {
		var constructorErrorMask;
		var elemNumIs1;
		var errorMsgs;
		var valid$Obj;

		// Perform validity tests of arguments passed to the constructor.
		valid$Obj = $.isJQueryObj(_$obj);
		elemNumIs1 = valid$Obj ? _$obj.length == 1 : false;

		// Set validity flag and error mask based on testing results; report any problems.
		_argsAreValid = valid$Obj && elemNumIs1;
		constructorErrorMask = !valid$Obj | ( ( valid$Obj && !elemNumIs1 ) << 1 );
		errorMsgs = [
			'I was not passed a valid jQuery object.',
			'I was passed a valid jQuery object, but it contained ' + _$obj.length +  ' elements ra\
ther than 1.'
		]
		_ReportConstructorErrors(constructorErrorMask, errorMsgs);
	}
}

return CssData;

} )( jQuery );