
// session handler
var sessionHandler = require('../../../classes/sessionhandler.js');

var run = function (sender, data) {
	// create new session for new client
	sessionHandler.create(sender);

	// send confirmation to creator
	sender.emit('message', '{ "module": "session", "action": "created", "data": "' + sender.id + '" }');

	// done
	return true;
};

module.exports = run;