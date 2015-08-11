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

// session handler
var sessionHandler = require('./sessionhandler.js');

var eventHandler = new EventhandlerClass();

// Class function that gets the prototype methods
function EventhandlerClass() {
}

// parse a string and see if it can be converted
// into an EventMessage structure
EventhandlerClass.prototype.parseEventFromString = function (eventString) {
	try {
		var eventObject = JSON.parse(eventString);
	} catch (e) {
		return false;
	}

	// done
	return eventObject;
}

// build an EventMessage structure based on the
// input parameters
EventhandlerClass.prototype.createEventObject = function (eventModule, eventAction, eventData) {
	
	// create event structure
	var eventObject = { "module": eventModule, "action": eventAction, "data": eventData };

	// done
	return eventObject;
}

// build an EventMessage string based on the
// input parameters
EventhandlerClass.prototype.createEventString = function (eventModule, eventAction, eventData) {
	
	// create event structure
	var eventString = '{ "module": "' + eventModule + '", "action": "' + eventAction + '", "data": "' + eventData + '" }';

	// done
	return eventString;
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
	var eventSourcePath = filePath.join(__dirname, '/../server_modules/' + event.module + '/' + event.action + '.js');

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

	// get full session object for socket connection
	var session = sessionHandler.getClientSessionForSocket(sender);
	if (!session) {
		// note that the reason we can't find a session might be
		// that this is the connection call
		if ((event.module == "session") && (event.action == "connect")) {
			session = sender;
		} else {
			console.log("# Could not find a valid session for id " + sender.id);
			return false;
		}
	}	

	// calling the actual module and action
	console.log("# Calling " + eventSourcePath + " with data \"" + event.data + "\"");
	var eventAction = require(eventSourcePath);
	var eventResult = eventAction(session, event.data);

	if (!eventResult) {
		console.log("# The call " + eventSourcePath + " with data \"" + event.data + "\" went wrong. INVESTIGATE!!!!");
	}
}

module.exports = eventHandler;