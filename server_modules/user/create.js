
// user handler
var userHandler = require('../../classes/userhandler.js');

var run = function (session, data) {
	// create a new game via the gamehandler
	var newUser = userHandler.createUser(session);
	
	// check if new player was created
	if (!newUser) {
		// player creation failed
		return false
	}
	
	// send confirmation to creator
	session.socket.emit('message', '{ "module": "user", "action": "created", "data": "' + newUser.id + '" }');

	// done
	return true;
};

module.exports = run;