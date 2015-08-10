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

var gameHandler = new GamehandlerClass();

// Class function that gets the prototype methods
function GamehandlerClass() {
	this.gameStorage = new Array();
}

GamehandlerClass.prototype.createGame = function() {	
	console.log("# Creating a new game");

// create new game object
	var newGame = new GameObject();
	newGame.gameId = uuid.v1();
	newGame.globalState = "";

	// add new game to list
	this.gameStorage.push(newGame);
	
	console.log("# We now have " + this.gameStorage.length + " games (added " + newGame.gameId + ")");
	return newGame.gameId;
}

GamehandlerClass.prototype.destroyGame = function(gameId) {	
	console.log("# Removing game with id " + gameId + " from game storage");

	// filter out game with respective id
	this.gameStorage = this.gameStorage.filter(function (el) {
		return el.gameId != gameId;
	});

	console.log("# We now have " + this.gameStorage.length + " games");
	return true;
}

GamehandlerClass.prototype.addPlayerToGame = function(session, gameId) {	
	console.log("# Adding player with id " + session.id + " to game with id " + gameId);

	// filter out game with respective id
	this.gameStorage = this.gameStorage.filter(function (el) {
		return el.gameId != gameId;
	});

	console.log("# We now have " + this.gameStorage.length + " games");
	return true;
}

GamehandlerClass.prototype.removePlayerFromGame = function() {	
}

/*
GamehandlerClass.prototype.AddEntityToGame = function() {	
}

GamehandlerClass.prototype.RemoveEntityFromGame = function() {	
}

GamehandlerClass.prototype.AddEntityToPlayer = function() {	
}

GamehandlerClass.prototype.RemoveEntityFromPlayer = function() {	
}
*/

// Reference object for a game
function GameObject() {
	// game id for referencing
	this.gameId = "";

	// global state for this game
	// note: this is NOT the game state for a user!
	this.gameState = "";
}

module.exports = gameHandler;