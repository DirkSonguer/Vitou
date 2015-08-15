
// user handler
var userHandler = require('../../classes/userhandler.js');

// session handler
var sessionHandler = require('../../classes/sessionhandler.js');

var run = function (session, data) {
	// get user object
	var userObject = userHandler.getUserObject(data);

	// TODO: Well, proper authentication via oauth or something

	// check if user exists
	if ((!userObject) || (typeof userObject.id === 'undefined')) {
		console.log("# No user found in storage");
		return false;
	}
	
	// add user to current session
	sessionHandler.sessionStorage[session.index].user = userObject.id;

	// send confirmation to user
	session.socket.emit('message', '{ "module": "user", "action": "authenticated", "data": "' + userObject.id + '" }');
			
	// done
	return true;
};

module.exports = run;