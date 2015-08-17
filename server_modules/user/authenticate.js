
// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// get session object
	var sessionObject = storageHandler.get(session.id);
	
	// check if session has an attached user
	if (sessionObject.user != "") {
		// user already authenticated
		return false;
	}

	// get user object
	var userObject = storageHandler.get(data);

	// check if user object does exist
	if (!userObject) {
		// no user object found
		return false;
	}
		
	// check if object is really a user object
	if (userObject.type != "UserObject") {
		// this is not a user object
		return false;
	}

	// bind user object to session
	sessionObject.user = userObject.id;
	storageHandler.set(session.id, sessionObject);

	// send confirmation to creator
	var event = '{ "module": "user", "action": "authenticated", "data": "' + userObject.id + '" }';
	communicationHandler.sendToSession(event, sessionObject);
			
	// done
	return true;
};

module.exports = run;