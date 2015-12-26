// NOTE: this adds a filename and line number to winston's output
// Example output: 'info (routes/index.js:34) GET 200 /index'
var winston = require('winston');
var _ = require('lodash');
var expressWinston = require('express-winston');
var path = require('path')
var PROJECT_ROOT = path.join(__dirname, '..')

var transports = {
	console: new winston.transports.Console({
		colorize: true,
		timestamp: function() {
			return '[' + colorize(new Date().toGMTString(), 'grey') + ']';
		},
	}),
	consoleJSON: new winston.transports.Console({
		colorize: true,
		timestamp: function() {
			return '[' + colorize(new Date().toGMTString(), 'grey') + ']';
		},
		json: true
	})
}
var logger = new winston.Logger({
	transports: [ transports.console ]
});

// this allows winston to handle output from express' morgan middleware
logger.stream = {
	write: function (message) {
		logger.info(message)
	}
}

// A custom logger interface that wraps winston, making it easy to instrument
// code and still possible to replace winston in the future.

module.exports = _.assign({}, logger, {
	log: function(){
		logger.debug.apply(logger, formatLogArguments(arguments));
	},
	debug: function(){
		logger.debug.apply(logger, formatLogArguments(arguments));
	},
	info: function(){
		logger.info.apply(logger, formatLogArguments(arguments));
	},
	warn: function(){
		logger.warn.apply(logger, formatLogArguments(arguments));
	},
	error: function(){
		logger.error.apply(logger, formatLogArguments(arguments));
	},
	stream: logger.stream,
	getExpressLogger: function(){
		return expressWinston.logger({
			transports: [ transports.console ]
		});
	},
	getExpressErrorLogger: function(){
		return expressWinston.errorLogger({
			transports: [ transports.consoleJSON ]
		});
	},
	profile: logger.profile
});

/**
 * Attempts to add file and line number info to the given log arguments.
 */
function formatLogArguments (args) {
	args = Array.prototype.slice.call(args)

	var stackInfo = getStackInfo(1)

	if (stackInfo) {
		// get file path relative to project root
		var calleeStr = stackInfo.relativePath + ':' + stackInfo.line;
		calleeStr = colorize('(' + calleeStr + ')', 'grey');

		if (typeof (args[0]) === 'string') {
			args[0] = calleeStr + ' ' + args[0]
		} else {
			args.unshift(calleeStr)
		}
	}

	return args
}

/**
 * Parses and returns info about the call stack at the given index.
 */
function getStackInfo (stackIndex) {
	// get call stack, and analyze it
	// get all file, method, and line numbers
	var stacklist = (new Error()).stack.split('\n').slice(3)

	// stack trace format:
	// http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
	// do not remove the regex expresses to outside of this method (due to a BUG in node.js)
	var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
	var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

	var s = stacklist[stackIndex] || stacklist[0]
	var sp = stackReg.exec(s) || stackReg2.exec(s)

	if (sp && sp.length === 5) {
		return {
			method: sp[1],
			relativePath: path.relative(PROJECT_ROOT, sp[2]),
			line: sp[3],
			pos: sp[4],
			file: path.basename(sp[2]),
			stack: stacklist.join('\n')
		}
	}
}

function colorize(txt, color){
	if(!color)return txt;
	var colors = {
	    bold: [1, 22],
	    italic: [3, 23],
	    underline: [4, 24],
	    inverse: [7, 27],
	    white: [37, 39],
	    grey: [90, 39],
	    black: [30, 39],
	    blue: [34, 39],
	    cyan: [36, 39],
	    green: [32, 39],
	    magenta: [35, 39],
	    red: [31, 39],
	    yellow: [33, 39]
	};
	var prefix = "\u001b[";
	return prefix + colors[color][0] + 'm' + txt + prefix + colors[color][1] + 'm';

}