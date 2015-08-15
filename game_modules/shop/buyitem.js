
/*
Input: TankEntity

// check if player has enough money
if (Player.HasMoneyComponent.bank > Input.TankEntity.PriceComponent.price) {
	createEntity(Player, Input.TankEntity);
	Player.HasMoneyComponent.bank =- Input.TankEntity.PriceComponent.price;
	return OK;
} else {
	return ERROR;
}
*/

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
	
	// get object for current user
	var userObject = userHandler.getUserObject(session.user);
	if (!userObject) {
		// no user found
		return false;
	}

	// get item that should be bought
	var requestedItem = gamedataHandler.getDataItemById(data);
	if (!requestedItem) {
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
	userHandler.updateUserData(userObject.userData, session.user);
	
	// send confirmation to client
	var event = '{ "module": "shop", "action": "buyitem", "data": "' + data + '" }';
	communicationHandler.sendEventToSession(event, session);

	// done
	return true;
};

module.exports = run;