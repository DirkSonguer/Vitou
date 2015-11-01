// *************************************************** //
// User get state event
//
// This event returns the state of the currently logged
// in user.
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
	
	// check if session has an attached user
	if (sessionObject.user == "") {
		logHandler.log('Could not get state for user: No user found in session', 3);
		return false;
	}

	// get user object
	var userObject = storageHandler.get(sessionObject.user);

	// send state to client
	var userDataString = JSON.stringify(userObject);
	var event = '{ "module": "user", "action": "state", "data": ' + userDataString + ' }';
	communicationHandler.sendToSession(event, sessionObject);
	
	// done
	return true;
};

module.exports = run;