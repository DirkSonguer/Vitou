
// UUID
var uuid = require('node-uuid');

// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// get session object
	var sessionObject = storageHandler.get(session.id);
	
	// check if session has an attached user
	if (sessionObject.user == "") {
		// user not authenticated
		return false;
	}

	// get user object
	var userObject = storageHandler.get(sessionObject.user);
		
	// check if session has an attached user
	if (userObject.type != "UserObject") {
		// this is not a user object
		return false;
	}

	// check if user already is in a game
	if (userObject.game != '') {
		// User already in a game
		return false;
	}

	// check if user already is in a lobby
	if (userObject.lobby != '') {
		// User already in a lobby
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