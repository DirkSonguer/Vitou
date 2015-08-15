
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
	
	// check if the given tank is actually in the users garage
	if (garageItemIds.indexOf(data) < 0) {
		// item not in garage
		return false;
	}

	// check if item is actually a tank
	var garageItem = gamedataHandler.getDataItemById(data);
	if ((typeof garageItem === 'undefined') && (garageItem.assemblage != 'tank')) {
		// item not a tank
		return false;
	}

	// set user data
	userObject.userData.activeTank = data;
	userHandler.updateUserData(userObject, session.user);

	// send confirmation to client
	var event = '{ "module": "garage", "action": "selecttank", "data": "' + data + '" }';
	communicationHandler.sendEventToSession(event, session);

	// done
	return true;
};

module.exports = run;