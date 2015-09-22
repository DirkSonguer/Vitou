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
	var messageAuthor = "anonymous";
	if (session.user) messageAuthor = session.user;
	var chatEvent = '{ "from": "' + messageAuthor + '", "message": "' + data + '" }';
	var chatMessage = '{ "module": "chat", "action": "message", "data": ' + chatEvent + ' }';
	
	// broadcast data
	communicationHandler.sendToAll(chatMessage, session);
	communicationHandler.sendToSession(chatMessage, session);

	// done		
	return true;
};

module.exports = run;