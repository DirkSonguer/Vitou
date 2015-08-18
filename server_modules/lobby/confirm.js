
// log handler
var logHandler = require('../../classes/loghandler.js');

// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// event handler
var eventHandler = require('../../classes/eventhandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

// configuration handler
var configurationHandler = require('../../classes/configurationhandler.js');

var run = function (session, data) {
 	// get session object
	var sessionObject = storageHandler.get(session.id);
	
	// check if session has an attached user
	if (sessionObject.user == "") {
		logHandler.log('Could not confirm lobby: User is not authenticated', 3);
		return false;
	}

	// get user object
	var userObject = storageHandler.get(sessionObject.user);
		
	// check if session has an attached user
	if ((!userObject) || (userObject.type != "UserObject")) {
		logHandler.log('Could not confirm lobby: No user object found', 3);
		return false;
	}

	// check if user already is in a lobby
	if (userObject.lobby == '') {
		logHandler.log('Could not confirm lobby: User is not in a lobby', 3);
		return false;
	}
	
	// get lobby object
	var lobbyObject = storageHandler.get(userObject.lobby);
		
	// check if given object really is a lobby
	if ((lobbyObject) && (lobbyObject.type != "LobbyObject")) {
		logHandler.log('Could not confirm lobby: Lobby object could not be found', 3);
		return false;
	}

	// add user to participants confirmed list
	lobbyObject.lobbyParticipantsConfirmed.push(userObject.id);
	storageHandler.set(lobbyObject.id, lobbyObject);
	
	// send update event to all clients in lobby
	var event = '{ "module": "lobby", "action": "playerconfirmed", "data": "' + userObject.id + '" }';
	communicationHandler.sendToUserList(event, lobbyObject.lobbyParticipants);
		
	// if all participants have already confirmed, start new game
	if (lobbyObject.lobbyParticipantsConfirmed.length == lobbyObject.lobbyParticipants.length) {
		// create new game
		event = eventHandler.createEventObject("system", "game", "createfromlobby", "");
		eventHandler.executeEvent(session, event);
	}		
		
	// done
	return true;
};

module.exports = run;