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
	this.gameData = new Array();
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
		var gameDataContent = JSON.parse(fileSystem.readFileSync(dataFilePath, 'utf8'));
		
		// read assemblage
		var gameDataAssemblage = gameDataContent.meta.assemblage;

		// add assemblage to global storage
		this.gameAssemblages.push(gameDataAssemblage);

		// get assemblage components
		var assemblageStructure = this.getStructureForAssemblage(gameDataAssemblage);

		// get structure for each component
		var dataStructure = {};
		for (var j = 0, jlen = assemblageStructure.data.length; j < jlen; j++) {
			var componentStructure = this.getStructureForComponent(assemblageStructure.data[j]);
		
			// add component to global storage
			this.gameComponents.push(assemblageStructure.data[j]);

			// create new component object
			var componentObject = {};
			componentObject[assemblageStructure.data[j]] = componentStructure.data;
			dataStructure = merge(dataStructure, componentObject);
		}
		
		// add structure to global storage
		this.gameStructures[gameDataAssemblage] = dataStructure;
		
		// iterate through data array
		for (var k = 0, klen = gameDataContent.data.length; k < klen; k++) {
			// fill new game data object with standard info
			var gameDataItem = new GameDataObject();
			gameDataItem.id = uuid.v1();
			gameDataItem.assemblage = gameDataAssemblage;
			gameDataItem.components = assemblageStructure.data;
			
			// transform the raw data into the component based structure
			var gameDataObject = this.transformData(gameDataContent.data[k], dataStructure);
			gameDataItem.data = gameDataObject;

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
		// check that this is objects own property 
		// not from prototype prop inherited
		if (dataStructure.hasOwnProperty(key)) {
			var obj = dataStructure[key];
			for (var prop in obj) {
				// if correct property, add it to structure and proceed
				if (obj.hasOwnProperty(prop)) {
					// this would keep the key -> value structure of the components
					// dataStructure[key][prop] = rawData[i];
					dataObject[prop] = rawData[i];
					i++;
				}
			}
		}
	}
	
	// done
	return dataObject;
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