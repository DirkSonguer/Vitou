
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