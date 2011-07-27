#!/usr/bin/env node

/**
 * Takes a list of files and runs them through JSHint
 *
 * Usage:
 *	  hint.js file1 file2 file3 ...
 */

/* jshint reads the next two comments for configuration on how to parse this file.
	To check hint.js against jshint, try ./hint.js ./hint.js */

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
