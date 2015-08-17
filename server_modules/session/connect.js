
// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// get session object
	var sessionObject = storageHandler.get(session.id);
	
	// check if session is already known
	if (sessionObject) {
		// session already exists
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
	communicationHandler.sendToSession(newSession, event);

	// done
	return newSession;
};

module.exports = run;