// event handler
var eventHandler = require('../../../classes/eventhandler.js');

var run = function (session, data) {
	// check if data is available
	if (!data) {
		// no data 
		return false;
	}
	
	// create message
	var chatMessage = eventHandler.createEventString("chat", "incomingmessage", data);
	
	// broadcast data
	session.socket.broadcast.emit('message', chatMessage);
	session.socket.emit('message', chatMessage);

	// done		
	return true;
};

module.exports = run;