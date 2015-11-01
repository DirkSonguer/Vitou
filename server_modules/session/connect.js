// *************************************************** //
// Session connect event
//
// This event connects a new session to the system.
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

// log handler
var logHandler = require('../../classes/loghandler.js');

// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// get session object
	var sessionObject = storageHandler.get(session.id);
	
	// check if session is already known
	if (sessionObject) {
		logHandler.log('Could not create session: Session already exists for client socket id', 3);
		return false;
	}

	// create new session object
	var SessionObject = require('../../structures/session.js');
	var newSession = new SessionObject();
	newSession.id = session.id;
	newSession.socket = session;

	// add new session to storage
	storageHandler.set(newSession.id, newSession);

	var event = '{ "module": "session", "action": "connected", "data": "' + session.id + '" }';
	communicationHandler.sendToSession(event, newSession);

	// done
	return newSession;
};

module.exports = run;