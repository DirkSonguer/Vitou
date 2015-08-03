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

SessionhandlerClass.prototype.createClientSession = function (session) {
	console.log("# Creating a new session for id " + session.id);

	// create new session object
	var newSession = new SessionObject();
	newSession.session = session;

	// add new session to list
	this.sessionStorage.push(newSession);

	console.log("# We now have " + this.sessionStorage.length + " sessions");
	return true;
}

SessionhandlerClass.prototype.destroyClientSession = function (session) {
	console.log("# Removing session with id " + session.id + " from session storage");

	// filter out session with respective id
	this.sessionStorage = this.sessionStorage.filter(function (el) {
		return el.session != session;
	});

	console.log("# We now have " + this.sessionStorage.length + " sessions");
	return true;
}

// Reference object for a session
function SessionObject() {
	this.session = "";

	// user attached to this session
	this.user = "";

	// lobby attached to this session
	this.lobbystate = "";

	// game data attached to this session	
	this.gamestate = "";
}

module.exports = sessionHandler;