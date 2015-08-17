
// reference object for a game
function GameObject() {
	// object type
	this.type = 'GameObject';

	// game id for referencing
	this.id = '';

	// contains the session ids of game participants
	this.gameParticipants = new Array();

	// global state for this game
	this.gameState = {};
	
	// individual player states
	// note: those are properties for player game state objects
	this.playerStates = {};
}

module.exports = GameObject;