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
	session.socket.broadcast.emit('message', chatMessage);	
	communicationHandler.sendEventToSession(chatMessage, session);

	// done		
	return true;
};

module.exports = run;