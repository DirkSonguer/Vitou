
// node utilities
var util = require('util');

// user handler
var userHandler = require('../../classes/userhandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {

	// check if session has an attached user
	if (session.user == "") {
		// no user found in session
		return false;
	}
	
	// get the user onject via the user handler
	var userObject = userHandler.getUserObject(session.user);

	// send state to client
	var userDataString = util.inspect(userObject.userData);
	var event = '{ "module": "user", "action": "state", "data": "' + userDataString + '" }';
	communicationHandler.sendEventToSession(event, session);
	
	// done
	return true;
};

module.exports = run;