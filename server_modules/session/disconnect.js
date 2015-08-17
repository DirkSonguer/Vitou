
// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// get session object
	var sessionObject = storageHandler.get(session.id);
	
	// check if session is already known
	if (!sessionObject) {
		// no session exists, no need to disconnect
		return false;
	}

	// delete session object from storage
	storageHandler.delete(session.id);

	var event = '{ "module": "session", "action": "connected", "data": "' + session.id + '" }';
	communicationHandler.sendToSession(event, sessionObject);

	// done
	return true;
};

module.exports = run;