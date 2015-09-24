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

class CommunicationhandlerClass {
    constructor() {
        this.configurationStorage = {};
    }
	
	// send a message to a specific socket
	sendToSession(message, session) {
		// emit message
		session.socket.emit('message', message);

		// done
		return true;
	}	

	// send event to a list of users
	sendToUserList(message, receiverList) {
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
	sendToAll(message, session) {
		// emit message
		session.socket.broadcast.emit('message', message);	

		// done
		return true;
	}
}

// export default new CommunicationhandlerClass();
var communicationHandler = new CommunicationhandlerClass();
module.exports = communicationHandler;