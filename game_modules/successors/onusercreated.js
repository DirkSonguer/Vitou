
// user handler
var userHandler = require('../../classes/userhandler.js');

// game data handler
var gamedataHandler = require('../../classes/gamedatahandler.js');

var run = function (session, data) {
	// set initial data structure for the new user
	var userData = gamedataHandler.gameStructures.user;
	
	// import initial tank
	var defaultTank = gamedataHandler.getGameDataByAssemblage('tank');
	userData.garage.push(defaultTank[0].id);
	userData.activeTank = defaultTank[0].id
	
	// import initial weaponturret
	var defaultWeaponTurret = gamedataHandler.getGameDataByAssemblage('weaponturret');
	userData.garage.push(defaultWeaponTurret[0].id);
	userData.weaponTurret = defaultWeaponTurret[0].id
		
	// store data in user object
	userHandler.updateUserData(session.user, userData);
	
	// done
	return true;
};

module.exports = run;