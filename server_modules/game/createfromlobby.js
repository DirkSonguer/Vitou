
// UUID
var uuid = require('node-uuid');

// log handler
var logHandler = require('../../classes/loghandler.js');

// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// game data handler
var gamedataHandler = require('../../classes/gamedatahandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// get session object
	var sessionObject = storageHandler.get(session.id);
	
	// check if session has an attached user
	if (sessionObject.user == "") {
		logHandler.log('Could not create game: User is not authenticated', 3);
		return false;
	}
	
	// get user object
	var userObject = storageHandler.get(sessionObject.user);
		
	// check if session has an attached user
	if ((!userObject) || (userObject.type != "UserObject")) {
		logHandler.log('Could not create game: No user object found', 3);
		return false;
	}

	// check if user was in a lobby when game was initiated
	if (userObject.lobby == '') {
		logHandler.log('Could not create game: User is not in a lobby', 3);
		return false;
	}
			
	// create new game object
	var GameObject = require('../../structures/game.js');
	var newGame = new GameObject();
	newGame.id = uuid.v1();
	newGame.globalState = '';
		
	// get lobby object
	var lobbyObject = storageHandler.get(userObject.lobby);

	// add players to the game
	for (var i = 0, len = lobbyObject.lobbyParticipantsConfirmed.length; i < len; i++) {
		// add player to game
		newGame.gameParticipants.push(lobbyObject.lobbyParticipantsConfirmed[i]);	
	
		// create player state within game
		newGame.playerStates[lobbyObject.lobbyParticipantsConfirmed[i]] = {};	
	
		// add game to player session
		var participantObject = storageHandler.get(lobbyObject.lobbyParticipantsConfirmed[i]);
		participantObject.lobby = '';
		participantObject.game = newGame.id;
		storageHandler.set(participantObject.id, participantObject);
	}

	// add new game to storage
	storageHandler.set(newGame.id, newGame);
	
	// send lobby update to all clients 
	event = '{ "module": "lobby", "action": "closed", "data": "' + lobbyObject.id + '" }';
	communicationHandler.sendToUserList(event, lobbyObject.lobbyParticipantsConfirmed);
	
	// send game update to all clients 
	var event = '{ "module": "game", "action": "created", "data": "' + newGame.id + '" }';
	communicationHandler.sendToUserList(event, lobbyObject.lobbyParticipantsConfirmed);

	// destroy lobby
	storageHandler.delete(userObject.lobby);

	// done
	return newGame;
};

module.exports = run;