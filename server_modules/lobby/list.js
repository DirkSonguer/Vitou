
// node utilities
var util = require('util');

// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// get session object
	var sessionObject = storageHandler.get(session.id);

	// get lobby object
	var lobbyObjects = storageHandler.getByProperty('type', 'LobbyObject');	
	
	// send list of lobbies to client
	var availableLobbiesString = util.inspect(lobbyObjects, { depth: null });
	var event = '{ "module": "lobby", "action": "list", "data": "' + availableLobbiesString + '" }';
	communicationHandler.sendToSession(event, sessionObject);
			
	// done
	return true;
};

module.exports = run;