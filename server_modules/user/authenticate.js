
// storage handler
var storageHandler = require('../../classes/storagehandler.js');

var run = function (session, data) {
	// get session object
	var sessionObject = storageHandler.get(session.id);
	
	// check if session has an attached user
	if (sessionObject.user != "") {
		// user already authenticated
		return false;
	}

	// get user object
	var userObject = storageHandler.get(data);
		
	// check if session has an attached user
	if (userObject.type != "UserObject") {
		// this is not a user object
		return false;
	}

	// bind user object to session
	sessionObject.user = userObject.id;
	storageHandler.set(session.id, sessionObject);

	// send confirmation to user
	session.socket.emit('message', '{ "module": "user", "action": "authenticated", "data": "' + userObject.id + '" }');
			
	// done
	return true;
};

module.exports = run;