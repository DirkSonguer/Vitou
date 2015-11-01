// *************************************************** //
// Authentication structure
//
// This structure reflects an authentication within
// the system.
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

// reference object for an authentication
function AuthenticationObject() {
	// object type
	this.type = 'AuthenticationObject';
	
	// user login id for referencing
	// note: this is defined by the users
	this.login = '';

	// password for the user
	this.password = '';
	
	// generated salt for the user
	this.salt = ''; 
	
	// user id the login is bound to
	this.user = '';	
}

module.exports = AuthenticationObject;