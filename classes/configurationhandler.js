// *************************************************** //
// Configurationhandler class
//
// This script takes care of loading and providing the
// general configuration.
// *************************************************** //

var configurationHandler = new ConfigurationhandlerClass();

// file system
var fileSystem = require('fs');
var filePath = require('path');

// Class function that gets the prototype methods
function ConfigurationhandlerClass() {
	this.configurationStorage = {};
}

// send a message to a specific socket
ConfigurationhandlerClass.prototype.loadConfiguration = function () {
	// load general server configuration
	var configurationFilePath = filePath.join(__dirname, '/../' + 'configuration.json');
	this.configurationStorage = JSON.parse(fileSystem.readFileSync(configurationFilePath));

	// done
	return true;
}

module.exports = configurationHandler;