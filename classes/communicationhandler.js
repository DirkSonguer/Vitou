// *************************************************** //
// Communicationhandler class
//
// This script takes care of handling outgoing
// communication.
// Note that this is not just "a chat", but every message
// sent to any client should be using this. Hence the
// message / payload formatting needs to be provided by
// the calling class.
// *************************************************** //

// storage handler
var storageHandler = require('./storagehandler.js');

// log handler
var logHandler = require('./loghandler.js');

var communicationHandler = new CommunicationhandlerClass();

// Class function that gets the prototype methods
function CommunicationhandlerClass() {
}

// send a message to a specific socket
CommunicationhandlerClass.prototype.sendToSession = function (message, session) {
	// emit message
	session.socket.emit('message', message);

	// done
	return true;
}

// send event to a list of users
CommunicationhandlerClass.prototype.sendToUserList = function (message, receiverList) {
	// check if receivers were given
	if (receiverList.length < 1) {
		return false;
	}
	
	// send message to all participants
	for (var i = 0, len = receiverList.length; i < len; i++) {
		var userSession = storageHandler.getByProperty('user', receiverList[i]);
		this.sendToSession(message, userSession[0]);
	}

	// done
	return true;
}

// broadcast event to all
CommunicationhandlerClass.prototype.sendToAll = function (message, session) {
	// emit message
	session.socket.broadcast.emit('message', message);	

	// done
	return true;
}

module.exports = communicationHandler;