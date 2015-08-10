
// game handler
var gameHandler = require('../../classes/gamehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

// lobby handler
var lobbyHandler = require('../../classes/lobbyhandler.js');

var run = function (session, data) {
	console.log("# Trying to create new game, initiated by player " + session.id + " and lobby " + session.lobby);
	
	// create a new game via the gamehandler
	var newGameUUID = gameHandler.createGame();
	
	// check if new game was created
	if (!newGameUUID) {
		// game creation failed
		return false
	}
	
	// get lobby data
	var lobbyData = lobbyHandler.getLobbyData(session.lobby);

	// send lobby update to all clients 
	event = '{ "module": "lobby", "action": "lobbyclosed", "data": "' + session.lobby + '" };';
	communicationHandler.sendEventToList(event, lobbyData.lobbyParticipantsConfirmed);
	
	// send game update to all clients 
	var event = '{ "module": "game", "action": "gamecreated", "data": "' + newGameUUID + '" };';
	communicationHandler.sendEventToList(event, lobbyData.lobbyParticipantsConfirmed);

	// destroy lobby
	lobbyHandler.destroyLobby(session.lobby);

	// done
	return true;
};

module.exports = run;