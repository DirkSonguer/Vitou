
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

	// get item that should be bought
	var requestedItem = storageHandler.get(data);
	if ((!requestedItem) || (requestedItem.type != "GameDataObject")) {
		// no item found
		return false;
	}

	// check if item is really for sale	
	if (requestedItem.components.indexOf('HasPriceComponent') < 0) {
		// item is not for sale
		return false;
	}
	
	// check if user has enough money
	if (userObject.userData.money < requestedItem.data.price) {
		// user does not have enough money
		return false;
	}
	
	// TODO: Make transaction safe
	userObject.userData.money -= requestedItem.data.price;
	userObject.userData.garage.push(data);
	storageHandler.set(userObject.id, userObject);
	
	// send confirmation to client
	var event = '{ "module": "shop", "action": "buyitem", "data": "' + data + '" }';
	communicationHandler.sendToSession(event, sessionObject);

	// done
	return true;
};

module.exports = run;