
// log handler
var logHandler = require('../../classes/loghandler.js');

// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// get session object
	var sessionObject = storageHandler.get(session.id);
	
	// check if session has an attached user
	if (sessionObject.user != "") {
		logHandler.log('# Could not authenticate user: User already authenticated', 3);
		return false;
	}

	// get user object
	var userObject = storageHandler.get(data);

	// check if object was found
	if ((!userObject) || (userObject.type != "UserObject")) {
		logHandler.log('# Could not authenticate user: Given data does not match to a user session', 3);
		return false;
	}

	// bind user object to session
	sessionObject.user = userObject.id;
	storageHandler.set(session.id, sessionObject);

	// send confirmation to authenticator
	var userDataString = JSON.stringify(userObject);
	var event = '{ "module": "user", "action": "authenticated", "data": ' + userDataString + ' }';
	communicationHandler.sendToSession(event, sessionObject);
			
	// done
	return true;
};

module.exports = run;