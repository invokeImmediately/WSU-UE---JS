/**
 * Node module used to build CSS and JS modules via gulp.
 *
 * @link	https://github.com/invokeImmediately/WSU-UE---JS/gulpBuilder.js
 * @author	invokeImmediately (Daniel C. Rieck)
 */

'use strict';

/* -------------------------------------------------------------------------------------------------
** §1: Variable Declarations
*/

// Import node modules that are dependencies in our gulp tasks.
var cleanCss = require( 'gulp-clean-css' );
var concat = require( 'gulp-concat' );
var extName = require( 'gulp-extname' );
var gcmq = require( 'gulp-group-css-media-queries' );
var gulp = require( 'gulp' );
var insert = require( 'gulp-insert' );
var insertLines = require( 'gulp-insert-lines' );
var lessc = require( 'gulp-less' );
var replace = require( 'gulp-replace' );
var uglifyJs = require( 'gulp-uglify' );
var pump = require( 'pump' );

/* -------------------------------------------------------------------------------------------------
** §2: Exported Class Declarations
*/

/**
 * Collection of settings needed to build CSS files for OUE websites using gulp.
 *
 * @param {RegExp} commentRemovalNeedle - Used to find and remove impermanent comments in the
 *     unminified source file.
 * @param {String} dependenciesPath - Location of Less build dependencies common to all OUE
 *     websites.
 * @param {String} fontImportStr - CSS @import rule for importing additional functions that will be
 *     prepended to the built stylesheet.
 * @param {String} insertingMediaQuerySectionHeader - Comment block for inline documentation to be
 *     inserted before the section of the built CSS file that will contain media queries.
 * @param {String} minCssFileExtension - Extension to be utilized on the minified built CSS file.
 * @param {String} minCssFileHeaderStr - File header comment for inline documentation to be
 *     prepended to the built CSS file. (Should be structured as a permanent comment.)
 */
module.exports.CssBuildSettings = function (commentRemovalNeedle, dependenciesPath, destFolder,
		fontImportStr, insertingMediaQuerySectionHeader, minCssFileExtension, minCssFileHeaderStr,
		sourceFile) {
	this.commentRemovalNeedle = commentRemovalNeedle;
	this.dependenciesPath = dependenciesPath;
	this.destFolder = destFolder;
	this.fontImportStr = fontImportStr;
	this.insertingMediaQuerySectionHeader = insertingMediaQuerySectionHeader;
	this.minCssFileExtension = minCssFileExtension;
	this.minCssFileHeaderStr = minCssFileHeaderStr;
	this.sourceFile = sourceFile;
}

/* -------------------------------------------------------------------------------------------------
** §3: Exported Function Declarations
*/

/**
 * Returns a replacement string that will render impermanent file header comments persistent through
 * minification.
 * 
 * This is a callback function to be used consistent with the second, replacement argument of
 * String.replace. It assumes the first, pattern argument to String.replace contained only one
 * capturing group.
 *
 * @param {String} match - The matched substring.
 * @param {String} match - The captured group.
 * @param {Number} offset - The offset of the matched substring within the whole string being
 *     examined.
 * @param {String} string - The whole string being examined.
 * @returns {String}
 */
module.exports.fixFileHeaderComments = function ( match, p1, offset, string ) {
	var replacementStr = match;
	if ( offset == 0 ) {
		replacementStr = '/*!';
	}
	return replacementStr;
}

/**
 * Uses gulp task automation to build a CSS stylesheet, and its minified version, from Less source
 * files.
 *
 * Built CSS stylesheets are intended to be used in the WSUWP CSS Stylesheet Editor.
 * 
 * @param {CssBuildSettings} settings
 */
module.exports.setUpCssBuildTask = function ( settings ) {
	gulp.task( 'buildMinCss', function ( callBack ) {
		pump( [
				gulp.src( settings.sourceFile ),
				lessc( {
					paths: [settings.dependenciesPath]
				} ),
				replace( settings.commentRemovalNeedle, '' ),
				insert.prepend( settings.fontImportStr ),
				insert.prepend( settings.minCssFileHeaderStr ),
				gulp.dest( settings.destFolder ),
				gcmq(),
				insertLines( settings.insertingMediaQuerySectionHeader ),
				cleanCss(),
				extName( settings.minCssFileExtension ),
				gulp.dest( settings.destFolder )
			],
			callBack
		);
	} );
}

/**
 * Uses gulp task automation to build a custom JS file, and its minified version, from dependencies.
 *
 * Built custom JS files are intended to be used in the WSUWP Custom JavaScript Editor.
 * 
 * @param {JsBuildSettings} settings
 */
module.exports.setUpJsBuildTask = function ( settings ) {
	gulp.task( 'buildMinJs', function ( callBack ) {
		pump( [
				gulp.src( settings.buildDependenciesList ),
				replace( settings.commentNeedle, settings.replaceCallback ),
				concat( settings.compiledJsFileName ),
				gulp.dest( settings.destFolder ),
				uglifyJs( {
					output: {
						comments: /^!/
					},
					toplevel: true,
				} ),
				extName( settings.minJsFileExtension ),
				gulp.dest( settings.destFolder )
			],
			callBack
		);
	} );
}