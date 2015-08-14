
// node utilities
var util = require('util');

// lobby handler
var lobbyHandler = require('../../classes/lobbyhandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// send list of lobbies to client
	var availableLobbiesString = util.inspect(lobbyHandler.lobbyStorage);
	var event = '{ "module": "lobby", "action": "list", "data": "' + availableLobbiesString + '" }';
	communicationHandler.sendEventToSession(event, session);
			
	// done
	return true;
};

module.exports = run;