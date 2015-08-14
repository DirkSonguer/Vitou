// *************************************************** //
// Gamehandler class
//
// This script takes care of all functions around one
// specific game. Note that the class is also
// responsible for generally spawning new game
// instances.
// *************************************************** //

// UUID
var uuid = require('node-uuid');

// log handler
var logHandler = require('./loghandler.js');

// session handler
var sessionHandler = require('./sessionhandler.js');

var gameHandler = new GamehandlerClass();

// Class function that gets the prototype methods
function GamehandlerClass() {
	this.gameStorage = new Array();
}

GamehandlerClass.prototype.createGame = function () {
	logHandler.log('Creating a new game', 0);

	// create new game object
	var newGame = new GameObject();
	newGame.id = uuid.v1();
	newGame.globalState = '';

	// add new game to list
	this.gameStorage.push(newGame);

	logHandler.log('We now have ' + this.gameStorage.length + ' games (added ' + newGame.id + ')', 2);
	return newGame.id;
}

GamehandlerClass.prototype.destroyGame = function (gameId) {
	logHandler.log('Removing game with id ' + gameId + ' from game storage', 0);

	// filter out game with respective id
	this.gameStorage = this.gameStorage.filter(function (el) {
		return el.gameId != gameId;
	});

	logHandler.log('Removing game with id ' + gameId + ' from game storage', 2);
	return true;
}

GamehandlerClass.prototype.addPlayerToGame = function (sessionId, gameId) {
	logHandler.log('Adding player with id ' + sessionId + ' to game with id ' + gameId, 0);

	// find index of a game with respective id
	var gamePos = this.gameStorage.map(function (x) { return x.id; }).indexOf(gameId);

	// no matching game found
	if (gamePos < 0) {
		return false;
	}
	
	// add player to game
	this.gameStorage[gamePos].gameParticipants.push(sessionId);	
	
	// create player state within game
	this.gameStorage[gamePos].playerStates[sessionId] = {};	

	// find index of a lobby with respective id
	var sessionPos = sessionHandler.sessionStorage.map(function (x) { return x.id; }).indexOf(sessionId);
	
	// no matching session found
	if (sessionPos < 0) {
		return false;
	}
	
	// add game to player session
	sessionHandler.sessionStorage[sessionPos].game = gameId;	

	// done
	logHandler.log('We now have ' + this.gameStorage[gamePos].gameParticipants.length + ' players in game ' + gameId, 2);
	return true;
}

GamehandlerClass.prototype.removePlayerFromGame = function () {
}

// get the game data for a given game
// note: this is not only the state, but the entire game object
GamehandlerClass.prototype.getGameData = function (gameId) {
	logHandler.log('Getting game data for game with id ' + gameId, 0);

	// find index of a game with respective id
	var gamePos = this.gameStorage.map(function (x) { return x.id; }).indexOf(gameId);

	// no matching game found
	if (gamePos < 0) {
		return false;
	}
	
	// done
	return this.gameStorage[gamePos];
}

// set the game state for a given game
GamehandlerClass.prototype.setGameState = function (gameId, gameState) {
	logHandler.log('Setting game state for game with id ' + gameId, 0);

	// find index of a game with respective id
	var gamePos = this.gameStorage.map(function (x) { return x.id; }).indexOf(gameId);

	// no matching game found
	if (gamePos < 0) {
		return false;
	}
	
	// set new game state object
	this.gameStorage[gamePos].gameState = gameState;
	
	// done
	return true;
}

// reference object for a game
function GameObject() {
	// game id for referencing
	this.id = '';

	// contains the session ids of game participants
	this.gameParticipants = new Array();

	// global state for this game
	this.gameState = {};
	
	// individual player states
	// note: this is an array of player game state objects
	this.playerStates = new Array();
}

module.exports = gameHandler;