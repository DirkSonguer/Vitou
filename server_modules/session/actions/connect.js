
// session handler
var sessionHandler = require('../../../classes/sessionhandler.js');

var run = function (sender, data) {
	// create new session for new client
	sessionHandler.createSession(sender);

	// send confirmation to creator
	sender.emit('message', '{ "module": "session", "action": "connected", "data": "' + sender.id + '" }');

	// done
	return true;
};

module.exports = run;