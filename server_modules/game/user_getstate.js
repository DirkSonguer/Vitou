
// node utilities
var util = require('util');

// user handler
var userHandler = require('../../classes/userhandler.js');

// game data handler
var gamedataHandler = require('../../classes/gamedatahandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (sender, data) {

	// check if session has an attached user
	if (sender.user == "") {
		console.log("# No user found in session");
		return false;
	}
	
	// get the user data via the user handler
	var userData = userHandler.getUserData(sender.user);

	// if user is not initialised, create initial structure	
	if (userData.length < 1) {
		userHandler.updateUserData(sender.user, gamedataHandler.gameStructures.player);
		userData = gamedataHandler.gameStructures.player;
	}
	
	// send state to client
	var userDataString = util.inspect(userData);
	var event = '{ "module": "game", "action": "userstate", "data": "' + userDataString + '" }';
	communicationHandler.sendEventToSession(event, sender);
	
	// done
	return true;
};

module.exports = run;