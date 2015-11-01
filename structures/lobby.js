// *************************************************** //
// Lobby structure
//
// This structure reflects a lobby within the system.
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

// reference object for a lobby
function LobbyObject() {
	// object type
	this.type = 'LobbyObject';

	// lobby id for referencing
	this.id = '';

	// contains the session ids of lobby participants
	this.lobbyParticipants = new Array();

	// contains the session ids of participants that already confirmed
	this.lobbyParticipantsConfirmed = new Array();

	// global state for this lobby
	// note: this is NOT the game state for a user!
	this.lobbyState = {};
}

module.exports = LobbyObject;