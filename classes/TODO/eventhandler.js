// *************************************************** //
// Eventhandler class
//
// This script takes care of handling incoming events.
// It also helps parsing incoming event strings into
// proper event objects.
// TODO: This is not a queue, this just executes what
// it gets!
// *************************************************** //

// file system
var fileSystem = require('fs');
var filePath = require('path');

// general server configuration
var serverConfiguration = JSON.parse(fileSystem.readFileSync(filePath.join(__dirname, '../configuration.json')));

var eventHandler = new EventhandlerClass();

// Class function that gets the prototype methods
function EventhandlerClass() {
}

// parse a string and see if it can be converted
// into an EventMessage structure
EventhandlerClass.prototype.parseEventString = function (eventString) {
	try {
		var event = JSON.parse(eventString);
	} catch (e) {
		return false;
	}

	return event;
}

// handle event
// sender = socket client
// event = object with structure EventMessage 
EventhandlerClass.prototype.executeEvent = function (sender, event) {
	// check if there is at least a module + action
	if ((typeof event === "undefined") || (typeof event.module === "undefined") || (typeof event.action === "undefined")) {
		console.log("# Event does not seem like a proper event message");
		return;
	}

	// TODO: OMFGWTF SECURITY!!!!
	
	// build path to event source file
	var eventSourcePath = filePath.join(__dirname, '/../server_modules/' + event.module + '/actions/' + event.action + '.js');

	// checking if module is on the blacklist
	if (serverConfiguration.privateServerDirectories.indexOf(event.module) != -1) {
		console.log("# Event calls a module that is on the list of private server directories: " + event.module);
		return false
	}

	// checking if the module and action actually exists in the system
	try {
		var stat = fileSystem.statSync(eventSourcePath);
		if (!stat.isFile()) {
			console.log("# Event is not implemented: " + eventSourcePath + " not found (Not a file)");
			return false;
		}
	} catch (e) {
		console.log("# Event is not implemented: " + eventSourcePath + " not found (" + e.code + ")");
		return false;
	}

	// calling the actual module and action
	console.log("# Calling " + eventSourcePath + " with data \"" + event.data + "\"");
	var eventAction = require(eventSourcePath);
	var eventResult = eventAction(sender, event.data);

	if (!eventResult) {
		console.log("# The call " + eventSourcePath + " with data \"" + event.data + "\" went wrong. INVESTIGATE!!!!");
	}
}

module.exports = eventHandler;