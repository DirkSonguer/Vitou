// *************************************************** //
// Lobby join event
//
// This event lets a user join an existing lobby.
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

// configuration handler
var configurationHandler = require('../../classes/configurationhandler.js');

var run = function (session, data) {
	// get session object
	let sessionObject = storageHandler.get(session.id);
	
	// check if session has an attached user
	if (sessionObject.user == "") {
		logHandler.log('Could not join lobby: User is not authenticated', 3);
		let event = '{ "module": "lobby", "action": "notjoin", "data": "" }';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}

	// get user object
	let userObject = storageHandler.get(sessionObject.user);
		
	// check if session has an attached user
	if ((!userObject) || (userObject.type != "UserObject")) {
		logHandler.log('Could not join lobby: No user object found', 3);
		let event = '{ "module": "lobby", "action": "notjoin", "data": "" }';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}

	// check if user already is in a game
	if (userObject.game != '') {
		logHandler.log('Could not join lobby: User is already in a game', 3);
		let event = '{ "module": "lobby", "action": "notjoin", "data": "" }';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}

	// check if user already is in a lobby
	if (userObject.lobby != '') {
		logHandler.log('Could not join lobby: User is already in a lobby', 3);
		let event = '{ "module": "lobby", "action": "notjoin", "data": "" }';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}
	
	// get lobby object
	let lobbyObject = storageHandler.get(data);
		
	// check if given object really is a lobby
	if ((!lobbyObject) || (lobbyObject.type != "LobbyObject")) {
		logHandler.log('Could not join lobby: Lobby object could not be found', 3);
		let event = '{ "module": "lobby", "action": "notjoin", "data": "" }';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}

	// check if lobby has space for new participants
	if (lobbyObject.lobbyParticipants.length >= configurationHandler.configurationStorage.lobby.maxParticipants) {
		logHandler.log('Could not join lobby: Lobby reached maximum members', 3);
		let event = '{ "module": "lobby", "action": "notjoin", "data": "" }';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}

	// add user to participants list
	lobbyObject.lobbyParticipants.push(userObject.id);
	storageHandler.set(lobbyObject.id, lobbyObject);
	
	// add lobby state to session
	userObject.lobby = lobbyObject.id;
	storageHandler.set(userObject.id, userObject);

	// send update event to all clients in lobby
	var event = '{ "module": "lobby", "action": "playerjoined", "data": "' + userObject.id + '" }';
	communicationHandler.sendToUserList(event, lobbyObject.lobbyParticipants);
			
	// done
	return true;
};

module.exports = run;