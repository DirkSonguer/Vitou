// *************************************************** //
// Lobbyhandler class
//
// This script takes care of all functions around one
// specific lobby. Note that the class is also
// responsible for generally spawning new lobby
// instances.
// *************************************************** //

// TODO: Call to get all open lobbies
// TODO: Ability to make lobbies private

// UUID
var uuid = require('node-uuid');

// configuration handler
var configurationHandler = require('./configurationhandler.js');

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

	// done
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

	// check if lobby has space for new participants
	if (this.lobbyStorage[lobbyPos].lobbyParticipants.length >= configurationHandler.configurationStorage.lobby.maxParticipants) {
		console.log("# Lobby already reached max participants");
		return false;
	}	

	// add session to participants list
	this.lobbyStorage[lobbyPos].lobbyParticipants.push(session.id);
	
	// add lobby state to session
	sessionHandler.sessionStorage[session.index].lobby = lobbyId;

	// done
	console.log("# Session " + session.id + " joined lobby " + lobbyId + ", lobby now has " + this.lobbyStorage[lobbyPos].lobbyParticipants.length + " participants");
	return this.lobbyStorage[lobbyPos];
}

// leave a lobby the user is in
LobbyhandlerClass.prototype.leaveLobby = function (session, lobbyId) {
	console.log("# Leaving lobby with id " + lobbyId);

	// check if user is really in the given lobby
	if (session.lobby != lobbyId) {
		console.log("# User is not in given lobby (" + lobbyId + " vs " + session.lobby + ")");
		return false;
	}
	
	// find index of the lobby with given id
	var lobbyPos = this.lobbyStorage.map(function (x) { return x.id; }).indexOf(lobbyId);

	// no matching lobby found
	if (lobbyPos < 0) {
		return false;
	}
	
	// again validate that user is in participants list
	var participantIndex = this.lobbyStorage[lobbyPos].lobbyParticipants.indexOf(session.id);
	
	// user not in lobby
	if (participantIndex < 0) {
		return false;
	}

	// remove lobby id from user session
	session.lobby = "";

	// remove session from participants list
	// console.log("# Participants before: " + this.lobbyStorage[lobbyPos].lobbyParticipants.length);
	this.lobbyStorage[lobbyPos].lobbyParticipants.splice(participantIndex, 1);
	// console.log("# Participants after: " + this.lobbyStorage[lobbyPos].lobbyParticipants.length);
	
	// check if lobby still has participants
	// if not, then remove
	if (this.lobbyStorage[lobbyPos].lobbyParticipants.length == 0) {
		this.destroyLobby(lobbyId);
		return true;
	}

	// done
	console.log("# Session " + session.id + " left lobby " + lobbyId + ", lobby now has " + this.lobbyStorage[lobbyPos].lobbyParticipants.length + " participants");
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

	// check if lobby has reached min participants
	if (this.lobbyStorage[lobbyPos].lobbyParticipants.length < configurationHandler.configurationStorage.lobby.minParticipants) {
		console.log("# Lobby has not yet reached min participants");
		return false;
	}	

	// add session to participants confirmed list
	this.lobbyStorage[lobbyPos].lobbyParticipantsConfirmed.push(session.id);

	// done
	console.log("# Session " + session.id + " confirmed lobby " + lobbyId + ", " + this.lobbyStorage[lobbyPos].lobbyParticipantsConfirmed.length + " / " + this.lobbyStorage[lobbyPos].lobbyParticipants.length);
	return this.lobbyStorage[lobbyPos];
}

// get lobby data
LobbyhandlerClass.prototype.getLobbyData = function (lobbyId) {
	console.log("# Getting lobby data for id " + lobbyId + " from lobby storage");

	// filter out lobby with respective id
	var lobbyData = this.lobbyStorage.filter(function (el) {
		return el.id == lobbyId;
	});
	
	// no lobby found
	if (lobbyData.length < 1) {
		return false;
	}

	// done
	return lobbyData[0];
}

// destroy lobby
LobbyhandlerClass.prototype.destroyLobby = function (lobbyId) {
	console.log("# Removing lobby with id " + lobbyId + " from lobby storage");

	// filter out lobby with respective id
	this.lobbyStorage = this.lobbyStorage.filter(function (el) {
		return el.id != lobbyId;
	});

	// done
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