
// session handler
var sessionHandler = require('../../../classes/sessionhandler.js');

var run = function (sender, data) {
	// destroy client session
	sessionHandler.destroyClientSession(sender);
	
	// done
	return true;
};

module.exports = run;