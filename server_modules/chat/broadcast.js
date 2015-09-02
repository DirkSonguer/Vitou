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
	var chatMessage = eventHandler.createEventString("system", "chat", "message", data);
	
	// broadcast data
	communicationHandler.sendToAll(chatMessage, session);
	communicationHandler.sendToSession(chatMessage, session);

	// done		
	return true;
};

module.exports = run;