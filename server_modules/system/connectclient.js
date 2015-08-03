
// session handler
var sessionHandler = require('../../classes/sessionhandler.js');

var run = function (sender, data) {
	// create new session for new client
	sessionHandler.createClientSession(sender.id);

	// done
	return true;
};

module.exports = run;