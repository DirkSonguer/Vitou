
// lobby handler
var lobbyHandler = require('../../classes/lobbyhandler.js');

// game handler
var gameHandler = require('../../classes/gamehandler.js');

// event handler
var eventHandler = require('../../classes/eventhandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// confirm the lobby participation
	var lobby = lobbyHandler.confirmLobby(session, data);

	// check if new lobby was created
	if (!lobby) {
		// lobby could not be joined
		return false
	}
	
	// send update event to all clients in lobby
	var event = '{ "module": "lobby", "action": "playerconfirmed", "data": "' + session.id + '" }';
	communicationHandler.sendEventToList(event, lobby.lobbyParticipants);

	// if all participants have already confirmed, start new game
	if (lobby.lobbyParticipantsConfirmed.length == lobby.lobbyParticipants.length) {
		// create new game
		event = eventHandler.createEventObject("system", "game", "createfromlobby", "");
		eventHandler.executeEvent(session, event);
	}
		
	// done
	return true;
};

module.exports = run;