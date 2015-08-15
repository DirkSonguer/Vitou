
// user handler
var userHandler = require('../../classes/userhandler.js');

// game data handler
var gamedataHandler = require('../../classes/gamedatahandler.js');

var run = function (session, data) {
	// set initial data structure for the new user
	var userData = gamedataHandler.gameStructures.user;
	userHandler.updateUserData(session.user, userData);
	
	// done
	return true;
};

module.exports = run;