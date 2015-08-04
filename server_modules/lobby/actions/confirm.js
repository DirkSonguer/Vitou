
// lobby handler
var lobbyHandler = require('../../../classes/lobbyhandler.js');

// game handler
var gameHandler = require('../../../classes/gamehandler.js');

// session handler
var sessionHandler = require('../../../classes/sessionhandler.js');

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
		// send update lobby state to all participants
		for (var i = 0, len = lobby.lobbyParticipantsConfirmed.length; i < len; i++) {
			// filter out session with respective id
			var clientSession = sessionHandler.sessionStorage.filter(function (el) {
				return el.id == lobby.lobbyParticipantsConfirmed[i];
			});

			// emit to found session
			clientSession[0].socket.emit('message', '{ "module": "lobby", "action": "playerconfirmed", "data": "' + session.id + '" };');
		}
	} else {		
		// create a new game via the gamehandler
		var newGameUUID = gameHandler.createGame();
	
		// check if new game was created
		if (!newGameUUID) {
			// game creation failed
			return false
		}
	
		// return game id to the clients so they can reference it
		for (var i = 0, len = lobby.lobbyParticipantsConfirmed.length; i < len; i++) {
			// filter out session with respective id
			var clientSession = sessionHandler.sessionStorage.filter(function (el) {
				return el.id == lobby.lobbyParticipantsConfirmed[i];
			});

			// emit to found session			
			clientSession[0].socket.emit('message', '{ "module": "game", "action": "gamecreated", "data": "' + newGameUUID + '" };');
		}
		
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