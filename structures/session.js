
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