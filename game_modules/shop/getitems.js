
// node utilities
var util = require('util');

// storage handler
var storageHandler = require('../../classes/storagehandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
 	// get session object
	var sessionObject = storageHandler.get(session.id);
	
	// check if session has an attached user
	if (sessionObject.user == "") {
		// user not authenticated
		return false;
	}
	
	var availableItems = new Array();
	// get the user data via the user handler
	if (data != '') {
		availableItems = storageHandler.getByProperty('assemblage', data);
	} else {
		availableItems = storageHandler.getByProperty('type', 'GameDataObject');
	}

	// send state to client
	var availableItemsString = util.inspect(availableItems);
	var event = '{ "module": "shop", "action": "items", "data": "' + availableItemsString + '" }';
	communicationHandler.sendToSession(event, sessionObject);
	
	// done
	return true;
};

module.exports = run;