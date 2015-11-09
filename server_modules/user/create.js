// *************************************************** //
// User create event
//
// This event creates a new user within the system.
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

// log handler
var logHandler = require('../../classes/loghandler.js');

// crypto handler
var crypto = require('crypto');

// UUID
var uuid = require('node-uuid');

// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// check if data is available
	if ((!data) || (typeof data.login == 'undefined') || (typeof data.password == 'undefined')) {
		logHandler.log('# Could not create a user: No or missing data', 1);
		let event = '{ "module": "user", "action": "notcreated", "data": "" }';
		communicationHandler.sendToSession(event, session);
		return false;
	}
	
	// get authentication object
	let authenticationObject = storageHandler.get(data.login);
	
	// check if user / authentication with that login already exists
	if ((authenticationObject) && (authenticationObject.user != "")) {
		logHandler.log('# Could not create user: User with login already exists', 3);
		let event = '{ "module": "user", "action": "notcreated", "data": "" }';
		communicationHandler.sendToSession(event, session);
		return false;
	}	

	// create new user object
	let UserObject = require('../../structures/user.js');
	let newUser = new UserObject();
	newUser.id = uuid.v1();
	newUser.userData = {};

	// add new user to storage
	storageHandler.set(newUser.id, newUser);

	// create new authentication object
	let AuthenticationObject = require('../../structures/authentication.js');
	let newAuthentication = new AuthenticationObject();

	// store login
	newAuthentication.login = data.login;
	newAuthentication.user = newUser.id;
		
	// create new hash from password
	let newUserHash = crypto.createHash('sha1');
	newUserHash.update(data.password);
	
	// add salt
	let newUserSalt = uuid.v1();
	newUserHash.update(newUserSalt);
	newAuthentication.salt = newUserSalt;

	// store final password hash	 
	let userHash = newUserHash.digest('hex');
	newAuthentication.password = userHash;
	
	// add new authentication to storage
	storageHandler.set(newAuthentication.login, newAuthentication);
	
	// summary	
	logHandler.log('# Created user ' + newAuthentication.login + ' with hash ' + newAuthentication.password, 2);

	// add new user to session
	// this acts as initial login once the user is created
	let sessionObject = storageHandler.get(session.id);
	sessionObject.user = newUser.id;
	storageHandler.set(session.id, sessionObject);
	
	// send confirmation to creator
	let userDataString = JSON.stringify(newUser);
	let event = '{ "module": "user", "action": "created", "data": ' + userDataString + ' }';
	communicationHandler.sendToSession(event, sessionObject);

	// done
	return newUser;
};

module.exports = run;