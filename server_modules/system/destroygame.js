
// game handler
var gameHandler = require('../../../classes/gamehandler.js');

var run = function (sender, data) {
	// destroy the given game via the gamehandler
	var state = gameHandler.destroyGame(data);
	
	// done
	return state;
};

module.exports = run;