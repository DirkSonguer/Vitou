
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
	
	// check if the given tank is actually in the users garage
	if (garageItemIds.indexOf(data) < 0) {
		// item not in garage
		return false;
	}

	// check if item is actually a tank
	var garageItem = storageHandler.get(data);
	
	// check if garage item is really a game data object
	if ((!garageItem) || (garageItem.type != "GameDataObject")) {
		// this is not a game data object
		return false;
	}

	// check if item is either a tank or weaponturret
	if ((garageItem.assemblage != 'tank') && (garageItem.assemblage != 'weaponturret')) {
		// item neither a tank nor weapon turret
		return false;
	}

	// set user data
	if (garageItem.assemblage == 'tank') {
		userObject.userData.activeTank = data;
	} else {
		userObject.userData.activeWeaponTurret = data;
	}
	
	storageHandler.set(userObject.id, userObject);

	// send confirmation to client
	var event = '{ "module": "garage", "action": "selecteditem", "data": "' + data + '" }';
	communicationHandler.sendToSession(event, sessionObject);

	// done
	return true;
};

module.exports = run;