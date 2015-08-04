
// lobby handler
var lobbyHandler = require('../../../classes/lobbyhandler.js');

var run = function (sender, data) {
	// create a new game via the gamehandler
	var newLobbyUUID = lobbyHandler.createLobby(sender.id);
	
	// check if new lobby was created
	if (!newLobbyUUID) {
		// lobby creation failed
		return false
	}
	
	// return lobby id to the client so he can reference it
	sender.emit('message', newLobbyUUID);

	// done
	return true;
};

module.exports = run;