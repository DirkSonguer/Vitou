
// storage handler
var storageHandler = require('../../classes/storagehandler.js');

var run = function (session, data) {
	// get session object
	var sessionObject = storageHandler.retrieve(session.id);
	
	// check if session has an attached user
	if (sessionObject.user != "") {
		// user already authenticated
		return false;
	}

	// get user object
	var userObject = storageHandler.retrieve(data);
		
	// check if session has an attached user
	if (userObject.type != "UserObject") {
		// this is not a user object
		return false;
	}

	// bind user object to session
	sessionObject.user = userObject.id;
	storageHandler.store(session.id, sessionObject);

	// send confirmation to user
	session.socket.emit('message', '{ "module": "user", "action": "authenticated", "data": "' + userObject.id + '" }');
			
	// done
	return true;
};

module.exports = run;