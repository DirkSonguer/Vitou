
// game handler
var gameHandler = require('../../classes/gamehandler.js');

var run = function (sender, data) {
	// create a new game via the gamehandler
	var newGameUUID = gameHandler.createGame();
	
	// check if new game was created
	if (!newGameUUID) {
		// game creation failed
		return false
	}
	
	// return game id to the client so he can reference it
	sender.emit('message', newGameUUID);

	// done
	return true;
};

module.exports = run;