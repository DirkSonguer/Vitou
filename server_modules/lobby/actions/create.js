
// lobby handler
var lobbyHandler = require('../../../classes/lobbyhandler.js');

var run = function (session, data) {
	// create a new game via the gamehandler
	var newLobby = lobbyHandler.createLobby(session);
	
	// check if new lobby was created
	if (!newLobby) {
		// lobby creation failed
		return false
	}
	
	// send confirmation to creator
	session.socket.emit('message', '{ "module": "lobby", "action": "created", "data": "' + newLobby.id + '" }');

	// done
	return true;
};

module.exports = run;