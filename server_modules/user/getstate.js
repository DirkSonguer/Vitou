
// node utilities
var util = require('util');

// log handler
var logHandler = require('../../classes/loghandler.js');

// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// check if session has an attached user
	if (session.user == "") {
		// no user found in session
		return false;
	}

	// get user object
	var userObject = storageHandler.get(session.user);

	logHandler.log(userObject, 4);

	// send state to client
	var userDataString = util.inspect(userObject);
	var event = '{ "module": "user", "action": "state", "data": "' + userDataString + '" }';
	communicationHandler.sendToSession(session, event);
	
	// done
	return true;
};

module.exports = run;