// *************************************************** //
// Session disconnect event
//
// This event disconnects a session from the system.
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
	if (!sessionObject) {
		logHandler.log('Could not disconnect session: No session exists, no need to disconnect', 3);
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