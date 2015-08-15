
// node utilities
var util = require('util');

// user handler
var userHandler = require('../../classes/userhandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {

	// check if session has an attached user
	if (session.user == "") {
		console.log("# No user found in session");
		return false;
	}
	
	// get the user data via the user handler
	var userData = userHandler.getUserData(session.user);

	// send state to client
	var userDataString = util.inspect(userData);
	var event = '{ "module": "user", "action": "state", "data": "' + userDataString + '" }';
	communicationHandler.sendEventToSession(event, session);
	
	// done
	return true;
};

module.exports = run;