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

// session handler
var sessionHandler = require('./sessionhandler.js');

var userHandler = new UserhandlerClass();

// Class function that gets the prototype methods
function UserhandlerClass() {
	this.userStorage = new Array();
}

// create a new user
UserhandlerClass.prototype.createUser = function (session) {
	console.log("# Creating a new user");

	// create new user object
	var newUser = new UserObject();
	newUser.id = uuid.v1();
	newUser.userData = {};

	// add new user to list
	this.userStorage.push(newUser);

	// add lobby state to session
	sessionHandler.sessionStorage[session.index].user = newUser.id;

	// done
	console.log("# We now have " + this.userStorage.length + " users (added " + newUser.id + ")");
	return newUser;
}

// delete user
UserhandlerClass.prototype.deleteUser = function (session) {
	console.log("# Deleting user with id " + session.user + " from user storage");

	// filter out lobby with respective id
	this.userStorage = this.userStorage.filter(function (el) {
		return el.id != session.user;
	});

	// clear user from session	
	session.user = "";

	// done
	console.log("# We now have " + this.userStorage.length + " users");
	return true;
}

// get user data
UserhandlerClass.prototype.getUserData = function (userId) {
	console.log("# Getting user data for id " + userId + " from user storage");

	// filter out lobby with respective id
	var userData = this.userStorage.filter(function (el) {
		return el.id == userId;
	});

	// no user found
	if (userData.length < 1) {
		return false;
	}

	// done
	return userData[0].userData;
}


// update user data
UserhandlerClass.prototype.updateUserData = function (userId, userData) {
	console.log("# Updating user data for id " + userId);

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



// Reference object for a user
function UserObject() {
	// user id for referencing
	this.id = "";

	// user specific data
	// note: this is NOT the game state for a user within a game!
	this.userData = "";
}

module.exports = userHandler;