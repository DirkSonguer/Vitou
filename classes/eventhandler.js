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

// log handler
var logHandler = require('./loghandler.js');

// configuration handler
var configurationHandler = require('./configurationhandler.js');

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
EventhandlerClass.prototype.createEventObject = function (eventType, eventModule, eventAction, eventData) {
	
	// create event structure
	var eventObject = { 'type': eventType, 'module': eventModule, 'action': eventAction, 'data': eventData };

	// done
	return eventObject;
}

// build an EventMessage string based on the
// input parameters
EventhandlerClass.prototype.createEventString = function (eventType, eventModule, eventAction, eventData) {
	
	// create event structure
	var eventString = '{ "type":"' + eventType + '",  "module": "' + eventModule + '", "action": "' + eventAction + '", "data": "' + eventData + '" }';

	// done
	return eventString;
}

// handle event
// sender = socket client
// event = object with structure EventMessage 
EventhandlerClass.prototype.executeEvent = function (sender, event) {
	// check if there is at least a module + action
	if ((typeof event === 'undefined') || (typeof event.module === 'undefined') || (typeof event.action === 'undefined')) {
		logHandler.log('Event does not seem like a proper event message', 3);
		return;
	}

	// TODO: OMFGWTF SECURITY!!!!
	
	// choose respective directory based on event type
	var eventDirectory = 'server_modules';
	if (event.type == 'game') {
		eventDirectory = 'game_modules';
	}
	
	// build path to event source file
	var eventSourcePath = filePath.join(__dirname, '/../' + eventDirectory + '/' + event.module + '/' + event.action + '.js');

	// checking if module is on the blacklist
	if (configurationHandler.configurationStorage.server.privateServerDirectories.indexOf(event.module) != -1) {
		logHandler.log('Event calls a module that is on the list of private server directories: ' + event.module, 3);
		return false
	}

	// checking if the module and action actually exists in the system
	try {
		var stat = fileSystem.statSync(eventSourcePath);
		if (!stat.isFile()) {
			logHandler.log('Event is not implemented: ' + eventSourcePath + ' not found (Not a file)', 3);
			return false;
		}
	} catch (e) {
		logHandler.log('Event is not implemented: ' + eventSourcePath + ' not found (' + e.code + ')', 3);
		return false;
	}

	// get full session object for socket connection
	var session = sessionHandler.getClientSessionForSocket(sender);
	if (!session) {
		// note that the reason we can't find a session might be
		// that this is the connection call
		if ((event.module == 'session') && (event.action == 'connect')) {
			session = sender;
		} else {
			logHandler.log('Could not find a valid session for id ' + sender.id, 2);
			return false;
		}
	}	

	// calling the actual module and action
	logHandler.log('Calling ' + eventSourcePath + ' with data ' + event.data, 0);
	var eventAction = require(eventSourcePath);
	var eventResult = eventAction(session, event.data);

	if (!eventResult) {
		logHandler.log('# The call ' + eventSourcePath + ' with data ' + event.data + ' went wrong. INVESTIGATE!!!!', 3);
	}
}

module.exports = eventHandler;