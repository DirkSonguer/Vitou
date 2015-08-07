
// session handler
var sessionHandler = require('../../../classes/sessionhandler.js');

var run = function (session, data) {	
	// send confirmation to client
	session.socket.emit('message', '{ "module": "session", "action": "disconnected", "data": "' + session.id + '" }');
	
	// remove client session from handler
	sessionHandler.destroy(session);
		
	// force disconnect client
	session.socket.disconnect();
	
	// done
	return true;
};

module.exports = run;