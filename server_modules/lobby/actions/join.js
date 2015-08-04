
// lobby handler
var lobbyHandler = require('../../../classes/lobbyhandler.js');

// session handler
var sessionHandler = require('../../../classes/sessionhandler.js');

var run = function (session, data) {
	// create a new game via the gamehandler
	var lobby = lobbyHandler.joinLobby(session, data);

	// check if new lobby was created
	if (!lobby) {
		// lobby could not be joined
		return false
	}

	// send update lobby state to all participants
	for (var i = 0, len = lobby.lobbyParticipants.length; i < len; i++) {
		// filter out session with respective id
		var clientSession = sessionHandler.sessionStorage.filter(function (el) {
			return el.id == lobby.lobbyParticipants[i];
		});

		// emit to found session
		clientSession[0].socket.emit('message', '{ "module": "lobby", "action": "newplayerjoined", "data": "' + session.id + '" };');
	}
			
	// done
	return true;
};

module.exports = run;