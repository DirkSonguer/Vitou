
// lobby handler
var lobbyHandler = require('../../../classes/lobbyhandler.js');

var run = function (sender, data) {
	// create a new game via the gamehandler
	var state = lobbyHandler.joinLobby(sender.id, data);
		
	// done
	return state;
};

module.exports = run;