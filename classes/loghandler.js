// *************************************************** //
// Loghandler class
//
// This script is a super simple logger.
// Yes, I know I should use Winston or Bunyan, but this
// is a PoC, ok?
// *************************************************** //

// configuration handler
var configurationHandler = require('./configurationhandler.js');

// node utilities
var util = require('util');

var logHandler = new LoghandlerClass();

// file system
var fileSystem = require('fs');
var filePath = require('path');

// Class function that gets the prototype methods
function LoghandlerClass() {
	this.configurationStorage = {};
}

// send a message to a specific socket
LoghandlerClass.prototype.log = function (message, severity) {
	// convert from object to string	
	if (typeof message === 'object') {
		message = util.inspect(message);
	}
	
	if (severity >= configurationHandler.configurationStorage.logging.logLevel) {
		console.log(Date.now() + ' # ' + process.pid + ' # ' + message);
	}

	// done
	return true;
}

module.exports = logHandler;