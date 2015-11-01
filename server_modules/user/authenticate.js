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
	
	logHandler.log("# User found, clearing existing sessions", 2);
	
	// storageHandler.getByPropertyArray({type: 'SessionObject', user: userObject.id});
	/*
	// clear existing sessions for user
	var userSessions = storageHandler.getByProperty('user', userObject.id);
	for (var i = 0, len = userSessions.length; i < len; i++) {
		logHandler.log("# Clearing " + userSessions[i].id + " of type " + userSessions[i].type, 1);
		storageHandler.delete(userSessions[i]);
	}
*/
	logHandler.log("# Binding new session", 2);

	// bind user object to current session
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