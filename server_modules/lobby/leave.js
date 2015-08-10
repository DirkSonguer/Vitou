
// lobby handler
var lobbyHandler = require('../../classes/lobbyhandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// leave lobby
	var lobby = lobbyHandler.leaveLobby(session, data);

	// check if lobby was left
	if (!lobby) {
		// lobby could not be left
		return false
	}
	
	// send update event to all clients still in lobby
	if (lobby.lobbyParticipants.length > 0) {
		var event = '{ "module": "lobby", "action": "playerleft", "data": "' + session.id + '" }';
		communicationHandler.sendEventToList(event, lobby.lobbyParticipants);
	}
			
	// done
	return true;
};

module.exports = run;