// *************************************************** //
// Chat broadcast event
//
// This event sends a given chat message to all connected
// sessions.
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

// event handler
var eventHandler = require('../../classes/eventhandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// check if data is available
	if (!data) {
		// no data 
		return false;
	}
	
	// create message
	let messageAuthor = "anonymous";
	if (session.user) messageAuthor = session.user;
	let chatEvent = '{ "from": "' + messageAuthor + '", "message": "' + data + '" }';
	let chatMessage = '{ "module": "chat", "action": "message", "data": ' + chatEvent + ' }';
	
	// broadcast data
	communicationHandler.sendToAll(chatMessage, session);
	communicationHandler.sendToSession(chatMessage, session);

	// done		
	return true;
};

module.exports = run;