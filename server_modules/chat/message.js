
// log handler
var logHandler = require('../../classes/loghandler.js');

// event handler
var eventHandler = require('../../classes/eventhandler.js');

// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// check if data is available
	if ((!data) || (typeof data.message == 'undefined') || (typeof data.to == 'undefined')) {
		logHandler.log('# Could not send chat message: No or missing data', 1);
		return false;
	}
	
	// get session object for respective user
	var sessionObject = storageHandler.getByProperty('user', data.to);
		
	// check if given id is actually an allowed user
	if ((sessionObject.length < 1) || (sessionObject[0].type != "SessionObject")) {
		logHandler.log('# Could not send chat message: No session object found with given id', 1);
		return false;
	}
	
	// create message
	var messageAuthor = "anonymous";
	if (session.user) messageAuthor = session.user;
	var chatEvent = '{ "from": "' + messageAuthor + '", "message": "' + data.message + '" }';
	var chatMessage = '{ "module": "chat", "action": "message", "data": ' + chatEvent + ' }';

	// send data to recipient
	communicationHandler.sendToSession(chatMessage, sessionObject[0]);

	// done		
	return true;
};

module.exports = run;