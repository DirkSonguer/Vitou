// *************************************************** //
// Gamedata class
//
// This script takes care of loading and handling the
// general game data.
// Note: Game data in this case means the data that is
// defined beforehand by game design. This class does NOT
// handle the individual instances of the data. This is
// the entitycomponenthandler.
// *************************************************** //

// UUID
var uuid = require('node-uuid');

// file system
var fileSystem = require('fs');
var filePath = require('path');

var gamedataHandler = new GamedatahandlerClass();

// Class function that gets the prototype methods
function GamedatahandlerClass() {
	this.gameData = new Array();
}

GamedatahandlerClass.prototype.loadData = function () {
	console.log("# Loading game data");

	// get list of files in /data/gamedata
	var dataFilesPath = filePath.join(__dirname, '/../data/gamedata/');
	var dataFilesList = fileSystem.readdirSync(dataFilesPath);
	
	// iterate through files
	for (var i = 0, ilen = dataFilesList.length; i < ilen; i++) {
		console.log("# Loading data for file " + dataFilesList[i] + "(" + (i + 1) + "/" + dataFilesList.length + ")");

		// open file and get data
		var dataFilePath = filePath.join(__dirname, '/../data/gamedata/' + dataFilesList[i]);
		var gameDataContent = JSON.parse(fileSystem.readFileSync(dataFilePath));
		
		// read assemblage
		var gameDataAssemblage = gameDataContent.meta.assemblage;
		console.log("# Data assemblage: " + gameDataAssemblage);

		// iterate through data array
		for (var j = 0, jlen = gameDataContent.data.length; j < jlen; j++) {
			console.log("# Data: " + gameDataContent.data[j]);
			
			// fill new game data object
			var gameDataItem = new GameDataObject();
			gameDataItem.id = uuid.v1();
			gameDataItem.assemblage = gameDataAssemblage;
			gameDataItem.data = gameDataContent.data[j];

			// push new item on game data array
			this.gameData.push(gameDataItem);
		}
	}
	
	// done
	return true;
}

// Reference object for a dame data item
function GameDataObject() {
	// game data id for referencing
	this.id = "";

	// contains the assemblage for the data item
	this.assemblage = new Array();

	// contains the actual data
	this.data = new Array();
}

module.exports = gamedataHandler;