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

// session handler
var sessionHandler = require('./sessionhandler.js');

var lobbyHandler = new LobbyhandlerClass();

// Class function that gets the prototype methods
function LobbyhandlerClass() {
	this.lobbyStorage = new Array();
}

// create a new lobby
LobbyhandlerClass.prototype.createLobby = function (session) {
	console.log("# Creating a new lobby initiated by " + session.id);

	// check if user already is in a game
	if (session.game != "") {
		console.log("# User already in a game (" + session.game + ")");
		return false;
	}

	// check if user already is in a lobby
	if (session.lobby != "") {
		console.log("# User already in a lobby (" + session.lobby + ")");
		return false;
	}

	// create new lobby object
	var newLobby = new LobbyObject();
	newLobby.id = uuid.v1();
	newLobby.lobbyParticipants.push(session.id);
	newLobby.lobbyState = "";

	// add new lobby to list
	this.lobbyStorage.push(newLobby);

	// add lobby state to session
	sessionHandler.sessionStorage[session.index].lobby = newLobby.id;

	console.log("# We now have " + this.lobbyStorage.length + " lobbies (added " + newLobby.id + ")");
	return newLobby;
}

// join an already existing lobby
LobbyhandlerClass.prototype.joinLobby = function (session, lobbyId) {
	console.log("# Joining lobby with id " + lobbyId);

	// check if user already is in a game
	if (session.game != "") {
		console.log("# User already in a game (" + session.game + ")");
		return false;
	}

	// check if user already is in a lobby
	if (session.lobby != "") {
		console.log("# User already in a lobby (" + session.lobby + ")");
		return false;
	}
	
	// find index of the lobby with given id
	var lobbyPos = this.lobbyStorage.map(function (x) { return x.id; }).indexOf(lobbyId);

	// no matching lobby found
	if (lobbyPos < 0) {
		return false;
	}

	// add session to participants list
	this.lobbyStorage[lobbyPos].lobbyParticipants.push(session.id);
	
	// add lobby state to session
	sessionHandler.sessionStorage[session.index].lobby = lobbyId;

	console.log("# Session " + session.id + " joined lobby " + lobbyId + ", lobby now has " + this.lobbyStorage[lobbyPos].lobbyParticipants.length + " participants");
	return this.lobbyStorage[lobbyPos];
}

// confirm that the game can start
// the game will start once all participants in a lobby have confirmed
LobbyhandlerClass.prototype.confirmLobby = function (session, lobbyId) {
	console.log("# Confirming lobby with id " + lobbyId);
	
	// check if user is really in the respective lobby
	if (session.lobby != lobbyId) {
		console.log("# User not in the given lobby (" + session.lobby + ")");
		return false;
	}

	// find index of a lobby with respective id
	var lobbyPos = this.lobbyStorage.map(function (x) { return x.id; }).indexOf(lobbyId);

	// no matching lobby found
	if (lobbyPos < 0) {
		return false;
	}
	
	// check if the session is really in the lobby
	if (this.lobbyStorage[lobbyPos].lobbyParticipants.indexOf(session.id) < 0) {
		return false;
	}	

	// add session to participants confirmed list
	this.lobbyStorage[lobbyPos].lobbyParticipantsConfirmed.push(session.id);

	console.log("# Session " + session.id + " confirmed lobby " + lobbyId + ", " + this.lobbyStorage[lobbyPos].lobbyParticipantsConfirmed.length + " / " + this.lobbyStorage[lobbyPos].lobbyParticipants.length);
	return this.lobbyStorage[lobbyPos];
}

// destroy lobby
LobbyhandlerClass.prototype.destroyLobby = function (lobbyId) {
	console.log("# Removing lobby with id " + lobbyId + " from lobby storage");

	// filter out lobby with respective id
	this.lobbyStorage = this.lobbyStorage.filter(function (el) {
		return el.id != lobbyId;
	});

	console.log("# We now have " + this.lobbyStorage.length + " lobbies");
	return true;
}

// Reference object for a lobby
function LobbyObject() {
	// lobby id for referencing
	this.id = "";

	// contains the session ids of lobby participants
	this.lobbyParticipants = new Array();

	// contains the session ids of participants that already confirmed
	this.lobbyParticipantsConfirmed = new Array();

	// global state for this lobby
	// note: this is NOT the game state for a user!
	this.lobbyState = "";
}

module.exports = lobbyHandler;