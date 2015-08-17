
// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// get session object
	var sessionObject = storageHandler.get(session.id);
	
	// check if session has an attached user
	if (sessionObject.user == "") {
		// no user found in session
		return false;
	}

	// delete user object from storage
	storageHandler.delete(sessionObject.user);
	
	// send confirmation to creator
	var event = '{ "module": "user", "action": "deleted", "data": "' + sessionObject.id + '" }';
	communicationHandler.sendToSession(sessionObject, event);

	// remove user from current session
	sessionObject.user = '';
	storageHandler.set(session.id, sessionObject);

	// done
	return true;
};

module.exports = run;