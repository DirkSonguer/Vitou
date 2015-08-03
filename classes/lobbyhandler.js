// *************************************************** //
// Lobbyhandler class
//
// This script takes care of all functions around one
// specific lobby. Note that the class is also
// responsible for generally spawning new lobby
// instances.
// *************************************************** //

// UUID
var uuid = require('node-uuid');

// game handler
var gameHandler = require('./gamehandler.js');

var lobbyHandler = new LobbyhandlerClass();

// Class function that gets the prototype methods
function LobbyhandlerClass() {
	this.lobbyStorage = new Array();
}

// create a new lobby
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

// join an already existing lobby
LobbyhandlerClass.prototype.joinLobby = function (sessionId, lobbyId) {
	console.log("# Joining lobby with id " + lobbyId);
	
	// find index of a lobby with respective id
	var lobbyPos = this.lobbyStorage.map(function (x) { return x.lobbyId; }).indexOf(lobbyId);

	// no matching lobby found
	if (lobbyPos < 0) {
		return false;
	}

	// add session to participants list
	this.lobbyStorage[lobbyPos].lobbyParticipants.push(sessionId);

	console.log("# Session " + sessionId + " joined lobby " + lobbyId + ", lobby now has " + this.lobbyStorage[lobbyPos].lobbyParticipants.length + " participants");
	return true;
}

// confirm that the game can start
// the game will start once all participants in a lobby have confirmed
LobbyhandlerClass.prototype.confirmLobby = function (sessionId, lobbyId) {
	console.log("# Confirming lobby with id " + lobbyId);
	
	// find index of a lobby with respective id
	var lobbyPos = this.lobbyStorage.map(function (x) { return x.lobbyId; }).indexOf(lobbyId);

	// no matching lobby found
	if (lobbyPos < 0) {
		return false;
	}
	
	// check if the session is really in the lobby
	if (this.lobbyStorage[lobbyPos].lobbyParticipants.indexOf(sessionId) < 0) {
		return false;
	}	

	// add session to participants confirmed list
	this.lobbyStorage[lobbyPos].lobbyParticipantsConfirmed.push(sessionId);

	// check if all participants have already confirmed	
	if (this.lobbyStorage[lobbyPos].lobbyParticipantsConfirmed.length == this.lobbyStorage[lobbyPos].lobbyParticipants.length) {
	}

	console.log("# Session " + sessionId + " confirmed lobby " + lobbyId + ", " + this.lobbyStorage[lobbyPos].lobbyParticipantsConfirmed.length + " / " + this.lobbyStorage[lobbyPos].lobbyParticipants.length);
	return true;
}

// Reference object for a game
function LobbyObject() {
	// lobby id for referencing
	this.lobbyId = "";

	// contains the session ids of lobby participants
	this.lobbyParticipants = new Array();

	// contains the session ids of participants that already confirmed
	this.lobbyParticipantsConfirmed = new Array();

	// global state for this lobby
	// note: this is NOT the game state for a user!
	this.lobbyState = "";
}

module.exports = lobbyHandler;