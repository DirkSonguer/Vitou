
// node utilities
var util = require('util');

// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// get lobby object
	var lobbyObjects = storageHandler.getByProperty('type', 'LobbyObject');	
	
	// send list of lobbies to client
	var availableLobbiesString = util.inspect(lobbyObjects);
	var event = '{ "module": "lobby", "action": "list", "data": "' + availableLobbiesString + '" }';
	communicationHandler.sendToList(event, session);
			
	// done
	return true;
};

module.exports = run;