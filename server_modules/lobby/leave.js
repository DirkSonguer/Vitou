// *************************************************** //
// Lobby leave event
//
// This event lets a player leave from a lobby.
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
		logHandler.log('Could not leave lobby: User is not authenticated', 3);
		let event = '{ "module": "lobby", "action": "notleave", "data": "" }';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}

	// get user object
	var userObject = storageHandler.get(sessionObject.user);
		
	// check if session has an attached user
	if ((!userObject) || (userObject.type != "UserObject")) {
		logHandler.log('Could not leave lobby: No user object found', 3);
		let event = '{ "module": "lobby", "action": "notleave", "data": "" }';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}

	// check if user already is in a lobby
	if (userObject.lobby == '') {
		logHandler.log('Could not leave lobby: User is already in a lobby', 3);
		let event = '{ "module": "lobby", "action": "notleave", "data": "" }';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}
	
	// get lobby object
	let lobbyObject = storageHandler.get(userObject.lobby);
		
	// check if given object really is a lobby
	if ((!lobbyObject) || (lobbyObject.type != "LobbyObject")) {
		logHandler.log('Could not leave lobby: Lobby object could not be found', 3);
		let event = '{ "module": "lobby", "action": "notleave", "data": "" }';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}

	// remove user from participants list
	let cutIndex = lobbyObject.lobbyParticipants.indexOf(userObject.id);
	lobbyObject.lobbyParticipants.splice(cutIndex, 1);
	storageHandler.set(lobbyObject.id, lobbyObject);
	
	// remove lobby state from session
	userObject.lobby = '';
	storageHandler.set(userObject.id, userObject);
	
	// send update event to all clients still in lobby
	let event = '{ "module": "lobby", "action": "playerleft", "data": "' + userObject.id + '" }';
	communicationHandler.sendToUserList(event, lobbyObject.lobbyParticipants);
	
	// send to user
	communicationHandler.sendToSession(event, sessionObject);		

	// destroy lobby if no users are in it anymore
	if (lobbyObject.lobbyParticipants.length == 0) {
		storageHandler.delete(lobbyObject.id);		
	}
			
	// done
	return true;
};

module.exports = run;