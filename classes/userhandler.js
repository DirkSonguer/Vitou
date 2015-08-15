// *************************************************** //
// Userhandler class
//
// This script takes care of all functions around a
// specific user. The class is responsible for
// creating (adding) new users in the system,
// authenticating sessions (basically binding a user
// against them) as well as editing / removing user
// data.
// *************************************************** //

// UUID
var uuid = require('node-uuid');

// log handler
var logHandler = require('./loghandler.js');

// session handler
var sessionHandler = require('./sessionhandler.js');

var userHandler = new UserhandlerClass();

// Class function that gets the prototype methods
function UserhandlerClass() {
	this.userStorage = new Array();
}

// create a new user
UserhandlerClass.prototype.createUser = function (session) {
	logHandler.log('Creating a new user', 0);

	// create new user object
	var newUser = new UserObject();
	newUser.id = uuid.v1();
	newUser.userData = {};

	// add new user to list
	this.userStorage.push(newUser);

	// add lobby state to session
	sessionHandler.sessionStorage[session.index].user = newUser.id;

	// done
	logHandler.log('We now have ' + this.userStorage.length + ' users (added ' + newUser.id + ')', 2);
	return newUser;
}

// delete user
UserhandlerClass.prototype.deleteUser = function (userId) {
	logHandler.log('Deleting user with id ' + userId + ' from user storage', 0);

	// filter out lobby with respective id
	this.userStorage = this.userStorage.filter(function (el) {
		return el.id != userId;
	});

	// done
	logHandler.log('We now have ' + this.userStorage.length + ' users', 2);
	return true;
}

// get user data
UserhandlerClass.prototype.getUserObject = function (userId) {
	logHandler.log('Getting user object for id ' + userId + ' from user storage', 0);

	// filter out lobby with respective id
	var userData = this.userStorage.filter(function (el) {
		return el.id == userId;
	});

	// no user found
	if (userData.length < 1) {
		return false;
	}

	// done
	return userData[0];
}

// update user data
UserhandlerClass.prototype.updateUserData = function (userId, userData) {
	logHandler.log('Updating user data for id ' + userId, 0);

	// find index of a user with respective id
	var userPos = this.userStorage.map(function (x) { return x.id; }).indexOf(userId);

	// no matching lobby found
	if (userPos < 0) {
		return false;
	}
	
	// set user data
	this.userStorage[userPos].userData = userData;

	// done
	return true;
}

// reference object for a user
function UserObject() {
	// user id for referencing
	this.id = '';

	// user specific data
	// note: this is NOT the game state for a user within a game
	// this is user meta data for the platform!
	this.userData = '';
}

module.exports = userHandler;