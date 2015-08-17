
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

	// check if user already is in a lobby
	if (userObject.lobby == '') {
		// User is not in a lobby
		return false;
	}
	
	// get lobby object
	var lobbyObject = storageHandler.get(userObject.lobby);
		
	// check if given object really is a lobby
	if ((lobbyObject) && (lobbyObject.type != "LobbyObject")) {
		// this is not a lobby object
		return false;
	}

	// remove user from participants list
	var cutIndex = lobbyObject.lobbyParticipants.indexOf(userObject.id);
	lobbyObject.lobbyParticipants.splice(cutIndex, 1);
	storageHandler.set(lobbyObject.id, lobbyObject);
	
	// remove lobby state from session
	userObject.lobby = '';
	storageHandler.set(userObject.id, userObject);
	
	// send update event to all clients still in lobby
	if (lobbyObject.lobbyParticipants.length > 0) {
		// send to remaining participants
		var event = '{ "module": "lobby", "action": "playerleft", "data": "' + userObject.id + '" }';
		communicationHandler.sendToUserList(event, lobbyObject.lobbyParticipants);
		
		// send to user
		communicationHandler.sendToSession(event, sessionObject);		
	}
			
	// done
	return true;
};

module.exports = run;