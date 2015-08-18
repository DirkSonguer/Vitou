
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
	this.lobbyState = '';
}

module.exports = LobbyObject;