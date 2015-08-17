
// node utilities
var util = require('util');

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

	// get user object
	var userObject = storageHandler.get(sessionObject.user);

	// send state to client
	var userDataString = util.inspect(userObject);
	var event = '{ "module": "user", "action": "state", "data": "' + userDataString + '" }';
	communicationHandler.sendToSession(sessionObject, event);
	
	// done
	return true;
};

module.exports = run;