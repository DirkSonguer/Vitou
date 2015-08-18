
// reference object for a user
function UserObject() {
	// object type
	this.type = 'UserObject';
	
	// user id for referencing
	this.id = '';

	// link to the lobby the user is associated with
	this.lobby = '';

	// link to global game session the user is associated with
	this.game = '';

	// user specific data
	// note: this is NOT the game state for a user within a game
	// this is user meta data for the platform!
	this.userData = '';
}

module.exports = UserObject;