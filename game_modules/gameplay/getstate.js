
// node utilities
var util = require('util');

// user handler
var userHandler = require('../../classes/userhandler.js');

// game data handler
var gameHandler = require('../../classes/gamehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (sender, data) {

	// check if session has an attached user
	if (sender.user == "") {
		console.log("# No user found in session");
		return false;
	}

	// check if session has an attached game
	if (sender.game == "") {
		console.log("# No game found in session");
		return false;
	}
	
	// get the user data via the user handler
	var gameData = gameHandler.getGameData(sender.game);

	// send state to client
	var gameDataString = util.inspect(gameData);
	var event = '{ "module": "game", "action": "state", "data": "' + gameDataString + '" }';
	communicationHandler.sendEventToSession(event, sender);
	
	// done
	return true;
};

module.exports = run;