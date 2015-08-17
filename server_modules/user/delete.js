
// storage handler
var storageHandler = require('../../classes/storagehandler.js');

var run = function (session, data) {
	// get session object
	var sessionObject = storageHandler.get(session.id);
	
	// check if session has an attached user
	if (sessionObject.user == "") {
		// no user found in session
		return false;
	}

	// delete user object from storage
	storageHandler.delete(sessionObject.user);
	
	// send confirmation to user
	session.socket.emit('message', '{ "module": "user", "action": "deleted", "data": "' + session.user + '" }');

	// remove user from current session
	sessionObject.user = '';
	storageHandler.set(session.id, sessionObject);

	// done
	return true;
};

module.exports = run;