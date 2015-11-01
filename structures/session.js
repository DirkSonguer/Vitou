// *************************************************** //
// Session structure
//
// This structure reflects a session the system.
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

// reference object for a session
function SessionObject() {
	// object type
	this.type = 'SessionObject';

	// session id
	this.id = '';
	
	// io socket attached to this session
	this.socket = '';

	// link to user information (id)
	this.user = '';
}

module.exports = SessionObject;