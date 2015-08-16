
// UUID
var uuid = require('node-uuid');

// log handler
var logHandler = require('../../classes/loghandler.js');

// storage handler
var storageHandler = require('../../classes/storagehandler.js');

var run = function (session, data) {
	logHandler.log('Creating a new user', 0);

	// create new user object
	var UserObject = require('../../structures/user.js');
	var newUser = new UserObject();
	newUser.id = uuid.v1();
	newUser.userData = {};

	// add new user to storage
	storageHandler.store(newUser.id, newUser);

	// add new user to session
	// this acts as initial login once the user is created
	var sessionObject = storageHandler.retrieve(session.id);
	sessionObject.user = newUser.id;
	storageHandler.store(session.id, sessionObject);
	
	// send confirmation to creator
	session.socket.emit('message', '{ "module": "user", "action": "created", "data": "' + newUser.id + '" }');

	// done
	return true;
};

module.exports = run;