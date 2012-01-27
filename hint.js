#!/usr/bin/env node

/*!
 * hint.js
 *
 * Licensed under the same slightly modified MIT license that JSLint is.
 * It stops evil-doers everywhere.
 *
 * hint.js wraps JSHint, which is a derivative work of JSLint:
 *
 *   Copyright (c) 2002 Douglas Crockford  (www.JSLint.com)
 *
 *   Permission is hereby granted, free of charge, to any person obtaining
 *   a copy of this software and associated documentation files (the "Software"),
 *   to deal in the Software without restriction, including without limitation
 *   the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *   and/or sell copies of the Software, and to permit persons to whom
 *   the Software is furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included
 *   in all copies or substantial portions of the Software.
 *
 *   The Software shall be used for Good, not Evil.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 *
 * JSHint was forked from 2010-12-16 edition of JSLint.
 *
 */

/**
 * Takes a list of files and runs them through JSHint
 *
 * Usage: hint.js file1 file2 file3 ...
 */

/* jshint reads the next two comments for configuration on how to parse this file.
	To check hint.js against itself, try "hint.js hint.js" */

/*jshint boss: true, curly: true, undef: true, expr: true, white: true, node: true, noarg: true, trailing: true */
/*global console: true */


(function () {
	var fs = require('fs'),
	jshint = require('./jshint.js').JSHINT,
	files = [];

	function _hr() {
		console.log('-----------------------------------------');
	}

	function _JSHintResponseHandler(err, data, fileName) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}

		var options = {
			curly: true,
			boss: true,
			browser: true,
			undef: true,
			expr: true,
			trailing: true,
			white: true
		};

		var globals = {
		};

		var out, numErrors, error, i;

		if (jshint(data.toString(), options, globals)) {
			console.log('File ' + fileName + ' has no errors. Congrats!');
			out = jshint.data();
		} else {
			console.log('Errors in file ', fileName, '\n');
			out = jshint.data();

			for (i = 0, numErrors = out.errors.length; i < numErrors; i++) {
				error = out.errors[i];
				if (error) {
					console.log(error.line + ':' + error.character + ' -> ' + error.reason + ' -> ' + error.evidence);
				}
			}
		}

		// print globals
		if (out.globals) {
			console.log('\nGlobals: ');
			var globalsList = [];
			for (i = 0; i < out.globals.length; i++) {
				globalsList.push(out.globals[i]);
			}
			// case-insensitive sort
			globalsList.sort(
				function (x, y) {
					var a = x.toUpperCase(),
					b = y.toUpperCase();
					if (a > b) {
						return 1;
					} else if (a < b) {
						return -1;
					} else {
						return 0;
					}
				}
			);
			for (i = 0; i < globalsList.length; i++) {
				console.log('	' + globalsList[i]);
			}
		}
		_hr();
	}

	function _JSHintResponseHandlerFactory(fileName) {
		return function (err, data) {
			_JSHintResponseHandler(err, data, fileName);
		};
	}


	// get list of files
	process.argv.forEach(function (val) {
		files.push(val);
	});

	files.shift(); // the first entry is node; ignore
	files.shift(); // the second entry is the filename of the program; ignore

	if (files.length === 0) {
		console.log('Usage: hint.js file1 file2 file3 ...');
		return;
	}

	_hr();
	for (var i = 0; i < files.length; i++) {
		fs.readFile(files[i], _JSHintResponseHandlerFactory(files[i]));
	}
})();
