
// log handler
var logHandler = require('../../classes/loghandler.js');

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
		logHandler.log('Could not get state for user: No user found in session', 3);
		return false;
	}

	// get user object
	var userObject = storageHandler.get(sessionObject.user);

	// send state to client
	var userDataString = util.inspect(userObject);
	var event = '{ "module": "user", "action": "state", "data": "' + userDataString + '" }';
	communicationHandler.sendToSession(event, sessionObject);
	
	// done
	return true;
};

module.exports = run;