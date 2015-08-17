
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
	
	// get user object
	var userObject = storageHandler.get(sessionObject.user);
		
	// check if session has an attached user
	if ((!userObject) || (userObject.type != "UserObject")) {
		// this is not a user object
		return false;
	}
		
	// get all item ids in the users garage
	var garageItemIds = userObject.userData.garage;
	
	// object to hold the garage items
	var garageItems = new Array();
	
	// get actual data for garage items
	for (var i = 0, len = garageItemIds.length; i < len; i++) {
		garageItems.push(storageHandler.get(garageItemIds[i]));
	}

	// send garage items to client
	var garageItemsString = util.inspect(garageItems);
	var event = '{ "module": "garage", "action": "items", "data": "' + garageItemsString + '" }';
	communicationHandler.sendToSession(event, sessionObject);

	// done
	return true;
};

module.exports = run;