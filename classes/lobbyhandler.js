// *************************************************** //
// Lobbyhandler class
//
// This script takes care of all functions around one
// specific lobby. Note that the class is also
// responsible for generally spawning new lobby
// instances.
// *************************************************** //

var uuid = require('node-uuid');

var lobbyHandler = new LobbyhandlerClass();

// Class function that gets the prototype methods
function LobbyhandlerClass() {
	this.lobbyStorage = new Array();
}

LobbyhandlerClass.prototype.createLobby = function (sessionId) {
	console.log("# Creating a new lobby");

	// create new lobby object
	var newLobby = new LobbyObject();
	newLobby.lobbyId = uuid.v1();
	newLobby.lobbyParticipants.push(sessionId);
	newLobby.lobbyState = "";

	// add new lobby to list
	this.lobbyStorage.push(newLobby);

	console.log("# We now have " + this.lobbyStorage.length + " lobbies (added " + newLobby.lobbyId + ")");
	return newLobby.lobbyId;
}

LobbyhandlerClass.prototype.joinLobby = function (sessionId, lobbyId) {
	console.log("# Joining lobby with id " + lobbyId);
	
	// find index of a lobby with respective id
	var lobbyPos = this.lobbyStorage.map(function (x) { return x.lobbyId; }).indexOf(lobbyId);

	// no matching lobby found
	if (!lobbyPos) {
		return false;
	}

	// add session to participants list
	this.lobbyStorage[lobbyPos].lobbyParticipants.push(sessionId);

	console.log("# Session " + sessionId + " joined lobby " + lobbyId + ", lobby now has " + this.lobbyStorage[lobbyPos].lobbyParticipants.length + " participants");
	return true;
}


// Reference object for a game
function LobbyObject() {
	// lobby id for referencing
	this.lobbyId = "";

	// contains the session ids of lobby participants
	this.lobbyParticipants = new Array();

	// global state for this lobby
	// note: this is NOT the game state for a user!
	this.lobbyState = "";
}

module.exports = lobbyHandler;