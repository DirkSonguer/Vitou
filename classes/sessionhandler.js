// *************************************************** //
// Sessionhandler class
//
// This script takes care of all functions around a
// specific session. Note that a client gets a session
// as soon as it connects, so a session is not 1:1 bound
// to a game or user. 
// *************************************************** //

var sessionHandler = new SessionhandlerClass();

// Class function that gets the prototype methods
function SessionhandlerClass() {
	this.sessionStorage = new Array();
}

SessionhandlerClass.prototype.createClientSession = function (socket) {
	console.log("# Creating a new session for id " + socket.id);

	// create new session object
	var newSession = new SessionObject();
	newSession.id = socket.id;
	newSession.socket = socket;

	// add new session to list
	var sessionIndex = this.sessionStorage.push(newSession);
	this.sessionStorage[sessionIndex - 1].index = sessionIndex - 1;

	console.log("# We now have " + sessionIndex + " sessions");
	return true;
}

SessionhandlerClass.prototype.destroyClientSession = function (socket) {
	console.log("# Removing session with id " + socket.id + " from session storage");

	// filter out session with respective id
	this.sessionStorage = this.sessionStorage.filter(function (el) {
		return el.id != socket.id;
	});

	console.log("# We now have " + this.sessionStorage.length + " sessions");
	return true;
}

SessionhandlerClass.prototype.getClientSessionForSocket = function (socket) {
	console.log("# Getting session based on socket id " + socket.id);

	var session = this.sessionStorage.filter(function (el) {
		return el.id == socket.id;
	});
	
	// check if session has been found
	if (session.length < 1) {
		console.log("# No matching session found for id " + socket.id);
		return false;
	}

	console.log("# Found session with matching id " + socket.id);
	return session[0];
}


// Reference object for a session
function SessionObject() {
	// session id
	this.id = "";
	
	// index of the session within the system
	this.index = "";
	
	// io socket attached to this session
	this.socket = "";

	// user attached to this session
	this.user = "";

	// lobby attached to this session
	this.lobby = "";

	// game data attached to this session	
	this.game = "";
}

module.exports = sessionHandler;