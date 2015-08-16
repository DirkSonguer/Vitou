
// user handler
var userHandler = require('../../classes/userhandler.js');

// game data handler
var gameHandler = require('../../classes/gamehandler.js');

// game data handler
var gamedataHandler = require('../../classes/gamedatahandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// get initial data structure for the new game
	// var gameData = gamedataHandler.gameStructures.user;
	
var logHandler = require('../../classes/loghandler.js');
	
	var gameObject = gameHandler.getGameObject(data);
	logHandler.log(gameObject, 4);

	// define start states for all players
	for (var i = 0, len = gameObject.gameParticipants.length; i < len; i++) {
		var playerState = {};
		
		// get current player object
		var playerObject = userHandler.getUserObject(gameObject.gameParticipants[i]);
		logHandler.log(playerObject, 4);
		
		// set initial positions
		playerObject.userData.activeTank.x = Math.floor(Math.random() * 100)+1;
		playerObject.userData.activeTank.y = Math.floor(Math.random() * 100)+1;

		// set tank objects to state
		playerState['tank'] = playerObject.userData.activeTank;
		playerState['weaponturret'] = playerObject.userData.activeWeaponTurret;

		logHandler.log(playerState, 4);
	}

/*	


	var playerState = {};

	playerState['tank'];
	playerState['weaponturret'];
	
	/*
		// contains the session ids of game participants
		this.gameParticipants = new Array();
	
		// global state for this game
		this.gameState = {};
		
		// individual player states
		// note: this is an array of player game state objects
		this.playerStates = new Array();
	*/
	
	// done
	return true;
};

module.exports = run;