// *************************************************** //
// Chat group event
//
// This event sends a given chat message to a list of
// connected sessions.
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

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

	// check if there are actually recepients
	if (data.to.length < 1) {
		logHandler.log('# Could not send chat message: No array of recipients given', 1);
		return false;
	}

	// send message to all recipients
	for (var i = 0, ilen = data.to.length; i < ilen; i++) {	
		// get session object for respective user
		let userObject = storageHandler.getByProperty('user', data.to[i]);
		
		// check if given id is actually an allowed user
		if ((userObject.length < 1) || (userObject[0].type != "SessionObject")) {
			logHandler.log('# Could not send chat message: No session object found with given id', 1);
			return false;
		}

		// create message
		let messageAuthor = "anonymous";
		if (session.user) messageAuthor = session.user;
		let chatEvent = '{ "from": "' + messageAuthor + '", "message": "' + data.message + '" }';
		let chatMessage = '{ "module": "chat", "action": "message", "data": ' + chatEvent + ' }';

		// send data to recipient
		communicationHandler.sendToSession(chatMessage, userObject[0]);
	}
		
	// done		
	return true;
};

module.exports = run;