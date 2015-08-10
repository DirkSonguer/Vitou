
// player handler
var userHandler = require('../../classes/userhandler.js');

var run = function (session, data) {
	
	// create a new game via the gamehandler
	var user = userHandler.deleteUser(session)

	// check if player was deleted
	if (!user) {
		// player could not be deleted
		return false
	}	
	
	// send confirmation to creator
	session.socket.emit('message', '{ "module": "player", "action": "deleted", "data": "' + session.user + '" }');

	// done
	return true;
};

module.exports = run;