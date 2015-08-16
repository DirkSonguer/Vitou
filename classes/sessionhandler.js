// *************************************************** //
// Sessionhandler class
//
// This script takes care of all functions around a
// specific session. Note that a client gets a session
// as soon as it connects, so a session is not 1:1 bound
// to a game or user. 
// *************************************************** //

// log handler
var logHandler = require('./loghandler.js');

// storage handler
var storageHandler = require('./storagehandler.js');

var sessionHandler = new SessionhandlerClass();

// class function that gets the prototype methods
function SessionhandlerClass() {
}

SessionhandlerClass.prototype.createSession = function (socket) {
	logHandler.log('Creating a new session for id ' + socket.id, 0);
	
	// check if socket is already known
	if (storageHandler.exists(socket.id)) {
		logHandler.log('Session already exists for socket ' + socket.id, 3);
		return false;
	}

	// create new session object
	var newSession = new SessionObject();
	newSession.id = socket.id;
	newSession.socket = socket;

	// add new session to list
	storageHandler.store(newSession.id, newSession);
	
	// done
	return newSession;
}

SessionhandlerClass.prototype.destroySession = function (socket) {
	logHandler.log('Removing session with id ' + socket.id + ' from data storage', 0);

	// delete item from storage
	storageHandler.delete(socket.id);

	// done
	return true;
}

// reference object for a session
function SessionObject() {
	// session id
	this.id = '';
	
	// index of the session within the system
	this.index = '';
	
	// io socket attached to this session
	this.socket = '';

	// link to user information (id)
	this.user = '';
}

module.exports = sessionHandler;