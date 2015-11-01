// *************************************************** //
// Game structure
//
// This structure reflects a default game within
// the system.
// Note that there is no real game specific data attached
// to this yet.
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

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
	this.playerStates = new Array();
}

module.exports = GameObject;