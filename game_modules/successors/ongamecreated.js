
// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// game data handler
var gamedataHandler = require('../../classes/gamedatahandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// get initial data structure for the new game
	// this should be handed over by the system create game function
	var gameObject = data;

	var logHandler = require('../../classes/loghandler.js');
	logHandler.log(gameObject, 4);

	// check if given object is really a game
	if ((!gameObject) || (gameObject.type != "GameObject")) {
		// this is not a user object
		return false;
	}

	// define start states for all players
	for (var i = 0, len = gameObject.gameParticipants.length; i < len; i++) {
		var playerState = {};
		
		// get current player object (= user object)
		var playerObject = storageHandler.get(gameObject.gameParticipants[i]);
		
		// check if given object is really a user
		if ((!playerObject) || (playerObject.type != "UserObject")) {
			// this is not a user object
			return false;
		}
/*
		var tankData = gamedataHandler.getDataItemById(playerObject.activeTank);
		logHandler.log(tankData, 4);
		tankData.x = Math.floor(Math.random() * 100) + 1;
		tankData.y = Math.floor(Math.random() * 100) + 1;
		playerState['tank'] = tankData;

		var weaponturretData = gamedataHandler.getDataItemById(playerObject.activeWeaponTurret);
		playerState['weaponturret'] = weaponturretData;

		gameObject.playerStates[gameObject.gameParticipants[i]] = playerState;
		logHandler.log(playerState, 4);
*/
	}
	
	// done
	return true;
};

module.exports = run;