// *************************************************** //
// Lobby get state event
//
// This event returns the current lobby state.
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
		logHandler.log('Could not get state for lobby: User is not authenticated', 3);
		let event = '{ "module": "lobby", "action": "state", "data": "" }';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}

	// get user object
	let userObject = storageHandler.get(sessionObject.user);
		
	// check if session has an attached user
	if ((!userObject) || (userObject.type != "UserObject")) {
		logHandler.log('Could not get state for lobby: No user object found', 3);
		let event = '{ "module": "lobby", "action": "state", "data": "" }';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}

	// check if user already is in a lobby
	if (userObject.lobby == '') {
		logHandler.log('Could not get state for lobby: User is already in a lobby', 3);
		let event = '{ "module": "lobby", "action": "state", "data": "" }';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}

		// get lobby object
	let lobbyObject = storageHandler.get(userObject.lobby);

	// send state to client
	let lobbyDataString = JSON.stringify(lobbyObject);
	let event = '{ "module": "lobby", "action": "state", "data": ' + lobbyDataString + ' }';
	communicationHandler.sendToSession(event, sessionObject);
	
	// done
	return true;
};

module.exports = run;