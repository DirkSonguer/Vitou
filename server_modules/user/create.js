
// UUID
var uuid = require('node-uuid');

// storage handler
var storageHandler = require('../../classes/storagehandler.js');

var run = function (session, data) {
	// create new user object
	var UserObject = require('../../structures/user.js');
	var newUser = new UserObject();
	newUser.id = uuid.v1();
	newUser.userData = {};

	// add new user to storage
	storageHandler.set(newUser.id, newUser);

	// add new user to session
	// this acts as initial login once the user is created
	var sessionObject = storageHandler.get(session.id);
	sessionObject.user = newUser.id;
	storageHandler.set(session.id, sessionObject);
	
	// send confirmation to creator
	session.socket.emit('message', '{ "module": "user", "action": "created", "data": "' + newUser.id + '" }');

	// done
	return true;
};

module.exports = run;