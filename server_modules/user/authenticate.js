// *************************************************** //
// User authenticate event
//
// This event lets a user authenticate against the system.
// After this, the user will get a user object bound to
// the session.
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

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
	let sessionObject = storageHandler.get(session.id);
	
	// check if session has an attached user
	if (sessionObject.user != "") {
		logHandler.log('# Could not authenticate user: User already authenticated', 3);
		let event = '{ "module": "user", "action": "notauthenticated", "data": ""}';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}

	// check if data is available
	if ((!data) || (typeof data.login == 'undefined') || (typeof data.password == 'undefined')) {
		logHandler.log('# Could not authenticate user: No or missing data', 1);
		let event = '{ "module": "user", "action": "notauthenticated", "data": ""}';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}

	// get authentication object
	let authenticationObject = storageHandler.get(data.login);

	// check if object was found
	if ((!authenticationObject) || (authenticationObject.type != "AuthenticationObject")) {
		logHandler.log('# Could not authenticate user: Given data does not match to a user authentication', 3);
		let event = '{ "module": "user", "action": "notauthenticated", "data": ""}';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}
	
	// create new hash from password
	let newUserHash = crypto.createHash('sha1');
	newUserHash.update(data.password);
	
	// add salt
	newUserHash.update(authenticationObject.salt);	
	
	// check password hash
	let userHash = newUserHash.digest('hex');
	if (authenticationObject.password != userHash) {
		logHandler.log('# Could not authenticate user: Pass does not match', 3);
		let event = '{ "module": "user", "action": "notauthenticated", "data": ""}';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}
	
	// get user object
	let userObject = storageHandler.get(authenticationObject.user);
	
	// check if user can be found
	if ((!userObject) || (userObject.type != "UserObject")) {
		logHandler.log('# Could not authenticate user: User not found', 3);
		let event = '{ "module": "user", "action": "notauthenticated", "data": ""}';
		communicationHandler.sendToSession(event, sessionObject);
		return false;
	}

	logHandler.log("# Binding new session", 2);

	// bind user object to current session
	sessionObject.user = userObject.id;
	storageHandler.set(session.id, sessionObject);

	// send confirmation to authenticator
	let userDataString = JSON.stringify(userObject);
	let event = '{ "module": "user", "action": "authenticated", "data": ' + userDataString + ' }';
	communicationHandler.sendToSession(event, sessionObject);
			
	// done
	return true;
};

module.exports = run;