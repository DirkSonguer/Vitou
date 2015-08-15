
// node utilities
var util = require('util');

// user handler
var userHandler = require('../../classes/userhandler.js');

// game data handler
var gamedataHandler = require('../../classes/gamedatahandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// check if session has an attached user
	if (session.user == "") {
		console.log("# No user found in session");
		return false;
	}
	
	var availableItems = new Array();
	// get the user data via the user handler
	if (data != '') {
		availableItems = gamedataHandler.getGameDataByAssemblage(data);
	} else {
		availableItems = gamedataHandler.gameDataStorage;
	}

	// send state to client
	var availableItemsString = util.inspect(availableItems);
	var event = '{ "module": "shop", "action": "items", "data": "' + availableItemsString + '" }';
	communicationHandler.sendEventToSession(event, session);
	
	// done
	return true;
};

module.exports = run;