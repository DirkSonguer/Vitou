// *************************************************** //
// Communicationhandler class
//
// This script takes care of handling incoming and
// outgoing events.
// *************************************************** //

var communicationHandler = new CommunicationhandlerClass();

// session handler
var sessionHandler = require('./sessionhandler.js');

// Class function that gets the prototype methods
function CommunicationhandlerClass() {
}

// send a message to a specific socket
CommunicationhandlerClass.prototype.sendEventToSession = function (event, session) {
	// emit message
	session.socket.emit('message', event);

	// done
	return true;
}

// send event to a list of users
CommunicationhandlerClass.prototype.sendEventToList = function (event, receiverList) {
	// check if receivers were given	
	if (receiverList.length < 1) {
		return false;
	}

	// send message to all participants
	for (var i = 0, len = receiverList.length; i < len; i++) {
		// filter out session with respective id
		var clientSession = sessionHandler.sessionStorage.filter(function (el) {
			return el.id == receiverList[i];
		});

		// emit to found session
		this.sendEventToSession(event, clientSession[0]);
	}

	// done
	return true;
}

// broadcast event to all
CommunicationhandlerClass.prototype.sendEventToAll = function (event) {

	// done
	return true;
}



module.exports = communicationHandler;