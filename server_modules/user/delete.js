
// user handler
var userHandler = require('../../classes/userhandler.js');

// session handler
var sessionHandler = require('../../sessionhandler.js');

var run = function (session, data) {
	// check if session has an attached user
	if (session.user == "") {
		// no user found in session
		return false;
	}

	// delete user from storage
	var user = userHandler.deleteUser(session.user)

	// check if player was deleted
	if (!user) {
		// player could not be deleted
		return false
	}
	
	// send confirmation to user
	session.socket.emit('message', '{ "module": "user", "action": "deleted", "data": "' + session.user + '" }');

	// remove user from current session
	sessionHandler.sessionStorage[session.index].user = '';

	// done
	return true;
};

module.exports = run;