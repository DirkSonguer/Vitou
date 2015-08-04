
// lobby handler
var lobbyHandler = require('../../../classes/lobbyhandler.js');

// communication handler
var communicationHandler = require('../../../classes/communicationhandler.js');

var run = function (session, data) {
	// create a new game via the gamehandler
	var lobby = lobbyHandler.joinLobby(session, data);

	// check if new lobby was created
	if (!lobby) {
		// lobby could not be joined
		return false
	}
	
	// send update event to all clients in lobby
	var event = '{ "module": "lobby", "action": "newplayerjoined", "data": "' + session.id + '" };';
	communicationHandler.sendEventToList(event, lobby.lobbyParticipants);
			
	// done
	return true;
};

module.exports = run;