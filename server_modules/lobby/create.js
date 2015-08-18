
// UUID
var uuid = require('node-uuid');

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
		logHandler.log('Could not create lobby: User is not authenticated', 3);
		return false;
	}

	// get user object
	var userObject = storageHandler.get(sessionObject.user);
		
	// check if session has an attached user
	if ((!userObject) || (userObject.type != "UserObject")) {
		logHandler.log('Could not create lobby: No user object found', 3);
		return false;
	}

	// check if user already is in a game
	if (userObject.game != '') {
		logHandler.log('Could not create lobby: User is already in a game', 3);
		return false;
	}

	// check if user already is in a lobby
	if (userObject.lobby != '') {
		logHandler.log('Could not create lobby: User is already in a lobby', 3);
		return false;
	}

	// create new lobby object
	var LobbyObject = require('../../structures/lobby.js');
	var newLobby = new LobbyObject();
	newLobby.id = uuid.v1();
	newLobby.lobbyParticipants.push(userObject.id);
	newLobby.lobbyState = '';

	// add new lobby to storage
	storageHandler.set(newLobby.id, newLobby);

	// add lobby state to user
	userObject.lobby = newLobby.id;
	storageHandler.set(userObject.id, userObject);

	// send confirmation to creator
	var event = '{ "module": "lobby", "action": "created", "data": "' + newLobby.id + '" }';
	communicationHandler.sendToSession(event, sessionObject);

	// done
	return newLobby;
};

module.exports = run;