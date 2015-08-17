
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

	// check if user already is in a lobby
	if (userObject.lobby == '') {
		// User is not in a lobby
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
	if (lobbyObject.lobbyParticipants.length >= configurationHandler.configurationStorage.lobby.minParticipants) {
		// lobby does not have minimum amount of players
		return false;
	}

	// add user to participants confirmed list
	lobbyObject.lobbyParticipantsConfirmed.push(userObject.id);
	storageHandler.set(lobbyObject.id, lobbyObject);
	
	// send update event to all clients in lobby
	var event = '{ "module": "lobby", "action": "playerconfirmed", "data": "' + session.id + '" }';
	communicationHandler.sendToList(event, lobbyObject.lobbyParticipants);
		
	// done
	return true;
};

module.exports = run;