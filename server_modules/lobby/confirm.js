
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
		console.log("1");
		return false;
	}

	// get user object
	var userObject = storageHandler.get(sessionObject.user);
		
	// check if session has an attached user
	if (userObject.type != "UserObject") {
		// this is not a user object
		console.log("2");
		return false;
	}

	// check if user already is in a lobby
	if (userObject.lobby == '') {
		// User is not in a lobby
		console.log("3");
		return false;
	}
	
	// get lobby object
	var lobbyObject = storageHandler.get(userObject.lobby);
		
	// check if given object really is a lobby
	if (lobbyObject.type != "LobbyObject") {
		// this is not a lobby object
		console.log("4");
		return false;
	}

	// add user to participants confirmed list
	lobbyObject.lobbyParticipantsConfirmed.push(userObject.id);
	storageHandler.set(lobbyObject.id, lobbyObject);
	
	// send update event to all clients in lobby
	var event = '{ "module": "lobby", "action": "playerconfirmed", "data": "' + userObject.id + '" }';
	communicationHandler.sendToUserList(event, lobbyObject.lobbyParticipants);
		
	// done
	return true;
};

module.exports = run;