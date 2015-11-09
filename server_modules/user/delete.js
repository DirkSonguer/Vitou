// *************************************************** //
// User delete event
//
// This event deletes an existing user from the system.
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
	let sessionObject = storageHandler.get(session.id);
	
	// check if session has an attached user
	if (sessionObject.user == "") {
		logHandler.log('Could not delete user: No user found in session', 3);
		let event = '{ "module": "user", "action": "notdeleted", "data": "" }';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}

	// delete user object from storage
	storageHandler.delete(sessionObject.user);
	
	// send confirmation to creator
	let event = '{ "module": "user", "action": "deleted", "data": "' + sessionObject.id + '" }';
	communicationHandler.sendToSession(event, sessionObject);

	// remove user from current session
	sessionObject.user = '';
	storageHandler.set(session.id, sessionObject);

	// done
	return true;
};

module.exports = run;