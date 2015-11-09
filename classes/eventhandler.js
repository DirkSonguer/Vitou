// *************************************************** //
// Eventhandler class
//
// This script takes care of handling incoming events.
// It also helps parsing incoming event strings into
// proper event objects.
// TODO: This is not a queue, this just executes what
// it gets!
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

// file system
var fileSystem = require('fs');
var filePath = require('path');

// log handler
var logHandler = require('./loghandler.js');

// configuration handler
var configurationHandler = require('./configurationhandler.js');

// storage handler
var storageHandler = require('./storagehandler.js');

class EventhandlerClass {
    constructor() {
    }

	// build an EventMessage string based on the
	// input parameters
	createEventString(eventType, eventModule, eventAction, eventData) {
		// create event structure
		let eventString = '{ "type":"' + eventType + '",  "module": "' + eventModule + '", "action": "' + eventAction + '", "data": "' + eventData + '" }';

		// done
		return eventString;
	}
	
	// parse a string and see if it can be converted
	// into an EventMessage structure
	parseEventFromString(eventString) {
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
	createEventObject(eventType, eventModule, eventAction, eventData) {
		// create event structure
		let eventObject = { 'type': eventType, 'module': eventModule, 'action': eventAction, 'data': eventData };

		// done
		return eventObject;
	}

	// handle event
	// sender = socket client
	// event = object with structure EventMessage 
	executeEvent(sender, event) {
		// check if there is at least a module + action
		if ((typeof event === 'undefined') || (typeof event.module === 'undefined') || (typeof event.action === 'undefined')) {
			logHandler.log('Event does not seem like a proper event message', 3);
			return;
		}

		// TODO: OMFGWTF SECURITY!!!!
	
		// choose respective directory based on event type
		let eventDirectory = configurationHandler.configurationStorage.server.gameDirectory;
		if (event.type == 'system') {
			// checking if server module is active
			if (configurationHandler.configurationStorage.server.activeModules.indexOf(event.module) == -1) {
				logHandler.log('Event calls a module that is on the list of private server directories: ' + event.module, 3);
				return false
			}

			// set server modules dir
			eventDirectory = 'server_modules';
		}
	
		// build path to event source file
		let eventSourcePath = filePath.join(__dirname, '/../' + eventDirectory + '/' + event.module + '/' + event.action + '.js');

		// checking if the module and action actually exists in the system
		try {
			let stat = fileSystem.statSync(eventSourcePath);
			if (!stat.isFile()) {
				logHandler.log('Event is not implemented: ' + eventSourcePath + ' not found (Not a file)', 3);
				return false;
			}
		} catch (e) {
			logHandler.log('Event is not implemented: ' + eventSourcePath + ' not found (' + e.code + ')', 3);
			return false;
		}

		// get full session object for socket connection
		let session = storageHandler.get(sender.id);
		if (!session) {
			// note that the reason we can't find a session might be
			// that this is the connection call
			if ((event.module == 'session') && (event.action == 'connect')) {
				session = sender;
			} else {
				logHandler.log('Could not find a valid session for id ' + sender.id, 3);
				return false;
			}
		}	

		// calling the actual module and action
		logHandler.log('Calling ' + eventSourcePath + ' with data ' + event.data, 0);
		let eventAction = require(eventSourcePath);
		let eventResult = eventAction(session, event.data);

		// done
		if (!eventResult) {
			logHandler.log('# The call ' + eventSourcePath + ' with data ' + event.data + ' went wrong. INVESTIGATE!!!!', 3);
		} else {
			// check for relevant successors
			let eventString = event.type + '/' + event.module + '/' + event.action;
			let relevantSuccessors = configurationHandler.configurationStorage.successors.filter(function (el) {
				return el.if == eventString;
			});

			// if successors were found, execute the first one
			if (relevantSuccessors.length > 0) {
				logHandler.log('Found successor for ' + eventString + ', calling ' + relevantSuccessors[0].then, 2);
				let successorEventArray = relevantSuccessors[0].then.split('/');
				if (successorEventArray.length != 3) {
					logHandler.log('Successor has wrong format: ' + relevantSuccessors[0].then, 3);
					return false;
				}
		
				// build and execute successor event
				var successorEvent = eventHandler.createEventObject(successorEventArray[0], successorEventArray[1], successorEventArray[2], eventResult);
				eventHandler.executeEvent(session, successorEvent);
			}
		}
	}
}

// export default new EventhandlerClass();
var eventHandler = new EventhandlerClass();
module.exports = eventHandler;