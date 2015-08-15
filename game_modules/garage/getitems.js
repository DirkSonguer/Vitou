
// node utilities
var util = require('util');

// user handler
var userHandler = require('../../classes/userhandler.js');

// game data handler
var gamedataHandler = require('../../classes/gamedatahandler.js');

// communication handler
var communicationHandler = require('../../classes/communicationhandler.js');

var run = function (session, data) {
	// check if session has an attached user
	if (session.user == "") {
		// no user found in session
		return false;
	}
	
	// get object of current user
	var userObject = userHandler.getUserObject(session.user);
		
	// get all item ids in the users garage
	var garageItemIds = userObject.userData.garage;
	
	// object to hold the garage items
	var garageItems = new Array();
	
	// get actual data for garage items
	for (var i = 0, len = garageItemIds.length; i < len; i++) {
		garageItems.push(gamedataHandler.getDataItemById(garageItemIds[i]));
	}

	// send garage items to client
	var garageItemsString = util.inspect(garageItems);
	var event = '{ "module": "garage", "action": "items", "data": "' + garageItemsString + '" }';
	communicationHandler.sendEventToSession(event, session);

	// done
	return true;
};

module.exports = run;