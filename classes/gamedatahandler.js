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

// merge
var merge = require('merge');

// file system
var fileSystem = require('fs');
var filePath = require('path');

// log handler
var logHandler = require('./loghandler.js');

var gamedataHandler = new GamedatahandlerClass();

// Class function that gets the prototype methods
function GamedatahandlerClass() {
	this.gameDataStorage = new Array();
	this.gameAssemblages = new Array();
	this.gameComponents = new Array();
	this.gameStructures = new Array();
}

GamedatahandlerClass.prototype.loadData = function () {
	logHandler.log('Loading game data', 0);

	// get list of files in /data/gamedata
	var dataFilesPath = filePath.join(__dirname, '/../data/gamedata/');
	var dataFilesList = fileSystem.readdirSync(dataFilesPath);
	
	// iterate through files
	for (var i = 0, ilen = dataFilesList.length; i < ilen; i++) {
		logHandler.log('Loading data for file ' + dataFilesList[i] + '(' + (i + 1) + ' / ' + dataFilesList.length + ')', 0);

		// open file and get data
		var dataFilePath = filePath.join(__dirname, '/../data/gamedata/' + dataFilesList[i]);
		var dataFileContent = JSON.parse(fileSystem.readFileSync(dataFilePath, 'utf8'));
				
		// read assemblage type from data file
		// this will define what assemblage to use
		var dataFileAssemblage = dataFileContent.meta.assemblage;

		// add assemblage for current data file to global storage
		this.gameAssemblages.push(dataFileAssemblage);

		// get assemblage structure, basically the list of components
		var dataFileAssemblageStructure = this.getStructureForAssemblage(dataFileAssemblage);

		// this will hold the data structure for the entire assembly
		var dataStructureForAssembly = {};

		// get structure for each component and add them to the data structure to use
		for (var j = 0, jlen = dataFileAssemblageStructure.components.length; j < jlen; j++) {
			var componentStructure = this.getStructureForComponent(dataFileAssemblageStructure.components[j]);

			// add component to global storage
			this.gameComponents.push(dataFileAssemblageStructure.components[j]);

			// add component data structure into assemblage data structure
			dataStructureForAssembly = merge(dataStructureForAssembly, componentStructure.data);
		}

		// add structure to global storage
		this.gameStructures[dataFileAssemblage] = dataStructureForAssembly;

		// iterate through data array in the data file
		for (var k = 0, klen = dataFileContent.data.length; k < klen; k++) {
			// fill new game data object with standard info
			var gameDataItem = new GameDataObject();
			gameDataItem.id = uuid.v1();
			gameDataItem.assemblage = dataFileAssemblage;
			gameDataItem.components = dataFileAssemblageStructure.components;
					
			// transform the raw data into the component based structure
			var gameDataObject = this.transformData(dataFileContent.data[k], dataStructureForAssembly);
			gameDataItem.data = gameDataObject;
		
			// push new item on game data array
			this.gameDataStorage.push(gameDataItem);
			logHandler.log(gameDataItem, 0);
		}
	}

	// done
	return true;
}

// get game data with a given assemblage
GamedatahandlerClass.prototype.getGameDataByAssemblage = function (assemblage) {
	// filter out game data with respective assemblage
	var gameDataArray = this.gameDataStorage.filter(function (el) {
		return el.assemblage == assemblage;
	});

	// done
	return gameDataArray;
}


// load a given assemblage into an object
GamedatahandlerClass.prototype.getStructureForAssemblage = function (assemblage) {
	// build path to assemblage source file
	var assemblageSourcePath = filePath.join(__dirname, '/../data/assemblages/' + assemblage + '.json');

	// checking if the assemblage actually exists in the system
	try {
		var stat = fileSystem.statSync(assemblageSourcePath);
		if (!stat.isFile()) {
			logHandler.log('Assemblage does not exist: ' + assemblageSourcePath + ' not found (Not a file)', 0);
			return false;
		}
	} catch (e) {
		logHandler.log('Assemblage does not exist: ' + assemblageSourcePath + ' not found (' + e.code + ')', 0);
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
			logHandler.log('Component does not exist: ' + componentSourcePath + ' not found (Not a file)', 0);
			return false;
		}
	} catch (e) {
		logHandler.log('Component does not exist: ' + componentSourcePath + ' not found (' + e.code + ')', 0);
		return false;
	}
	
	// TODO: WTFCACHING!
	
	// load component structure from file system
	var componentObject = JSON.parse(fileSystem.readFileSync(componentSourcePath, 'utf8'));
	
	// done
	return componentObject;
}

// transform given raw data into the given component based structure
GamedatahandlerClass.prototype.transformData = function (rawData, dataStructure) {
	// define new data object to hold the data
	var dataObject = {};

	// iterate through the data structure
	// the first layer is the component
	var i = 0;
	for (var key in dataStructure) {
		dataObject[key] = rawData[i];
		i++;
	}
	// iterate through the data structure
	// the first layer is the component
	var i = 0;
	for (var key in dataStructure) {
		dataObject[key] = rawData[i];
		i++;
	}
	
	// done
	return dataObject;
}

// get data item
GamedatahandlerClass.prototype.getDataItem = function (itemId) {
	logHandler.log('Getting data item with id ' + itemId + ' from game data storage', 0);

	// filter out item with respective id
	var gameItemData = this.gameDataStorage.filter(function (el) {
		return el.id == itemId;
	});
	
	// no lobby found
	if (gameItemData.length < 1) {
		return false;
	}

	// done
	return gameItemData[0];
}

// reference object for a dame data item
function GameDataObject() {
	// game data id for referencing
	this.id = '';

	// contains the assemblage for the data item
	this.assemblage = '';

	// contains the components for the data item
	this.components = new Array();

	// contains the actual data
	this.data = new Array();
}

module.exports = gamedataHandler;