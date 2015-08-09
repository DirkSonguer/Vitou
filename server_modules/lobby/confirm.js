
// lobby handler
var lobbyHandler = require('../../../classes/lobbyhandler.js');

// game handler
var gameHandler = require('../../../classes/gamehandler.js');

// communication handler
var communicationHandler = require('../../../classes/communicationhandler.js');

var run = function (session, data) {
	// confirm the lobby participation
	var lobby = lobbyHandler.confirmLobby(session, data);

	// check if new lobby was created
	if (!lobby) {
		// lobby could not be joined
		return false
	}
	
	// check if all participants have already confirmed
	if (lobby.lobbyParticipantsConfirmed.length != lobby.lobbyParticipants.length) {
		// send update event to all clients in lobby
		var event = '{ "module": "lobby", "action": "playerconfirmed", "data": "' + session.id + '" }';
		communicationHandler.sendEventToList(event, lobby.lobbyParticipants);
	} else {		
		// create a new game via the gamehandler
		var newGameUUID = gameHandler.createGame();
	
		// check if new game was created
		if (!newGameUUID) {
			// game creation failed
			return false
		}
		
		// send lobby update to all clients 
		var event = '{ "module": "lobby", "action": "lobbyclosed", "data": "' + lobby.id + '" };';
		communicationHandler.sendEventToList(event, lobby.lobbyParticipantsConfirmed);

		// send game update to all clients 
		event = '{ "module": "game", "action": "gamecreated", "data": "' + newGameUUID + '" }';
		communicationHandler.sendEventToList(event, lobby.lobbyParticipantsConfirmed);
		
		// destory lobby
		lobbyHandler.destroyLobby(lobby.id);
		
		// done
		console.log("# Session " + session.id + " started a new game (" + newGameUUID + ")");
		return true;
	}
		
	// done
	return true;
};

module.exports = run;