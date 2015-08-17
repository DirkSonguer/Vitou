
// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

// configuration handler
var configurationHandler = require('../../classes/configurationhandler.js');

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
	
	// get lobby object
	var lobbyObject = storageHandler.get(data);
		
	// check if given object really is a lobby
	if (lobbyObject.type != "LobbyObject") {
		// this is not a lobby object
		return false;
	}

	// check if lobby has space for new participants
	if (lobbyObject.lobbyParticipants.length >= configurationHandler.configurationStorage.lobby.maxParticipants) {
		// lobby already reached max participants
		return false;
	}

	// add user to participants list
	lobbyObject.lobbyParticipants.push(userObject.id);
	storageHandler.set(lobbyObject.id, lobbyObject);
	
	// add lobby state to session
	userObject.lobby = lobbyObject.id;
	storageHandler.set(userObject.id, userObject);

	// send update event to all clients in lobby
	var event = '{ "module": "lobby", "action": "playerjoined", "data": "' + session.id + '" }';
	communicationHandler.sendToList(event, lobbyObject.lobbyParticipants);
			
	// done
	return true;
};

module.exports = run;