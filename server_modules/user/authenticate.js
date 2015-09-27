
// log handler
var logHandler = require('../../classes/loghandler.js');

// crypto handler
var crypto = require('crypto');

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

	// check if data is available
	if ((!data) || (typeof data.login == 'undefined') || (typeof data.password == 'undefined')) {
		logHandler.log('# Could not authenticate user: No or missing data', 1);
		return false;
	}

	// get authentication object
	var authenticationObject = storageHandler.get(data.login);

	// check if object was found
	if ((!authenticationObject) || (authenticationObject.type != "AuthenticationObject")) {
		logHandler.log('# Could not authenticate user: Given data does not match to a user authentication', 3);
		return false;
	}
	
	// create new hash from password
	var newUserHash = crypto.createHash('sha1');
	newUserHash.update(data.password);
	
	// add salt
	newUserHash.update(authenticationObject.salt);	
	
	// check password hash
	var userHash = newUserHash.digest('hex');
	if (authenticationObject.password != userHash) {
		logHandler.log('# Could not authenticate user: Pass does not match', 3);
		return false;
	}
	
	// get user object
	var userObject = storageHandler.get(authenticationObject.user);
	
	// check if user can be found
	if ((!userObject) || (userObject.type != "UserObject")) {
		logHandler.log('# Could not authenticate user: User not found', 3);
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