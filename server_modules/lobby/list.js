// *************************************************** //
// Lobby list event
//
// This event lists the existing lobbies.
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

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
	var availableLobbiesString = JSON.stringify(lobbyObjects);
	var event = '{ "module": "lobby", "action": "list", "data": ' + availableLobbiesString + ' }';
	communicationHandler.sendToSession(event, sessionObject);
			
	// done
	return true;
};

module.exports = run;