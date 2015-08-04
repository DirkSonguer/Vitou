
// lobby handler
var lobbyHandler = require('../../../classes/lobbyhandler.js');

var run = function (sender, data) {
	// confirm the lobby participation
	var state = lobbyHandler.confirmLobby(sender.id, data);
		
	// done
	return state;
};

module.exports = run;