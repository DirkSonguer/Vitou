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
		var gameDataContent = JSON.parse(fileSystem.readFileSync(dataFilePath, 'utf8'));
		
		// read assemblage
		var gameDataAssemblage = gameDataContent.meta.assemblage;
			
		// get assemblage components
		var assemblageData = this.getStructureForAssemblage(gameDataAssemblage);
		
		var dataStructure = {};

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



// load a given assemblage into an object
GamedatahandlerClass.prototype.getStructureForAssemblage = function (assemblage) {
	// build path to assemblage source file
	var assemblageSourcePath = filePath.join(__dirname, '/../data/assemblages/' + assemblage + '.json');

	// checking if the assemblage actually exists in the system
	try {
		var stat = fileSystem.statSync(assemblageSourcePath);
		if (!stat.isFile()) {
			console.log("# Assemblage does not exist: " + assemblageSourcePath + " not found (Not a file)");
			return false;
		}
	} catch (e) {
		console.log("# Assemblage does not exist: " + assemblageSourcePath + " not found (" + e.code + ")");
		return false;
	}
	
	// TODO: WTFCACHING!
	
	// load assemblage structure from file system
	var assemblageObject = JSON.parse(fileSystem.readFileSync(assemblageSourcePath, 'utf8'));

	// done
	return assemblageObject;
}

// load a given component into an object
GamedatahandlerClass.prototype.getStructureForComponent = function (component) {

	// build path to component source file
	var componentSourcePath = filePath.join(__dirname, '/../data/components/' + component + '.json');

	// checking if the component actually exists in the system
	try {
		var stat = fileSystem.statSync(componentSourcePath);
		if (!stat.isFile()) {
			console.log("# Component does not exist: " + componentSourcePath + " not found (Not a file)");
			return false;
		}
	} catch (e) {
		console.log("# Component does not exist: " + componentSourcePath + " not found (" + e.code + ")");
		return false;
	}
	
	// TODO: WTFCACHING!
	
	// load component structure from file system
	var componentObject = JSON.parse(fileSystem.readFileSync(componentSourcePath, 'utf8'));
	
	// done
	return componentObject;
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