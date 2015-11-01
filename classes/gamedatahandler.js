// *************************************************** //
// Gamedata class
//
// This script takes care of loading and handling the
// general game data.
// Note: Game data in this case means the data that is
// defined beforehand by game design. This class does NOT
// handle the individual instances of the data. This is
// the entitycomponenthandler.
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

// UUID
var uuid = require('node-uuid');

// merge
var merge = require('merge');

// file system
var fileSystem = require('fs');
var filePath = require('path');

// storage handler
var storageHandler = require('./storagehandler.js');

// log handler
var logHandler = require('./loghandler.js');

// configuration handler
var configurationHandler = require('./configurationhandler.js');

class GamedatahandlerClass {
    constructor() {
		this.gameAssemblages = new Array();
		this.gameComponents = new Array();
		this.gameDataStructures = new Array();
	}

	// aggregated method to load all components, assemblages and date
	loadData() {
		logHandler.log('Loading game data', 2);

		// import all component structures
		this.importComponents();

		// import all assemblage structures
		this.importAssemblages();

		// import the actual game data
		this.importGameData();
	
		// done
		logHandler.log('Game data loaded', 2);
		return true;
	}

	// import components
	importComponents() {
		logHandler.log('Importing all components', 1);

		// get list of component files
		var componentFilesPath = filePath.join(__dirname, '/../' + configurationHandler.configurationStorage.server.gameDataDirectory + '/components/');
		var componentFilesList = fileSystem.readdirSync(componentFilesPath);
	
		// iterate through component files
		for (var i = 0, len = componentFilesList.length; i < len; i++) {
			logHandler.log('Loading component data for file ' + componentFilesList[i] + ' (' + (i + 1) + ' / ' + componentFilesList.length + ')', 0);
		
			// build path to component source file
			var componentSourcePath = filePath.join(__dirname, '/../' + configurationHandler.configurationStorage.server.gameDataDirectory + '/components/' + componentFilesList[i]);

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
		
			// load component structure from file system
			var componentObject = JSON.parse(fileSystem.readFileSync(componentSourcePath, 'utf8'));

			// add component to global storage
			this.gameComponents[componentObject.meta.name] = componentObject;
			logHandler.log('Component imported: ' + componentObject.meta.name, 0);
		}
	}

	// import assemblages
	importAssemblages() {
		logHandler.log('Importing all assemblages', 1);

		// get list of assemblage files
		var assemblageFilesPath = filePath.join(__dirname, '/../' + configurationHandler.configurationStorage.server.gameDataDirectory + '/assemblages/');
		var assemblageFilesList = fileSystem.readdirSync(assemblageFilesPath);
	
		// iterate through component files
		for (var i = 0, len = assemblageFilesList.length; i < len; i++) {
			logHandler.log('Loading assemblage data for file ' + assemblageFilesList[i] + ' (' + (i + 1) + ' / ' + assemblageFilesList.length + ')', 0);
	
			// build path to component source file
			var assemblageSourcePath = filePath.join(__dirname, '/../' + configurationHandler.configurationStorage.server.gameDataDirectory + '/assemblages/' + assemblageFilesList[i]);

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
	
			// load assemblage structure from file system
			var assemblageObject = JSON.parse(fileSystem.readFileSync(assemblageSourcePath, 'utf8'));
	
			// add assemblage to global storage
			this.gameAssemblages[assemblageObject.meta.name] = assemblageObject;
			logHandler.log('Assemblage imported: ' + assemblageObject.meta.name, 0);
		}
	}

	// import game data
	importGameData() {
		logHandler.log('Importing game data', 1);

		// get list of game data files
		var dataFilesPath = filePath.join(__dirname, '/../' + configurationHandler.configurationStorage.server.gameDataDirectory + '/gamedata/');
		var dataFilesList = fileSystem.readdirSync(dataFilesPath);
		
		// iterate through files
		for (var i = 0, ilen = dataFilesList.length; i < ilen; i++) {
			logHandler.log('Loading data for file ' + dataFilesList[i] + '(' + (i + 1) + ' / ' + dataFilesList.length + ')', 0);

			// open file and get data
			var dataFilePath = filePath.join(__dirname, '/../data/gamedata/' + dataFilesList[i]);
			var dataFileContent = JSON.parse(fileSystem.readFileSync(dataFilePath, 'utf8'));

			// this will hold the data structure for the entire assembly
			var dataStructureForAssembly = {};
	
			// get structure for each component and add them to the data structure to use
			for (var j = 0, jlen = this.gameAssemblages[dataFileContent.meta.assemblage].components.length; j < jlen; j++) {
				// add component data structure into assemblage data structure
				dataStructureForAssembly = merge(dataStructureForAssembly, this.gameComponents[this.gameAssemblages[dataFileContent.meta.assemblage].components[j]].data);
			}
		
			// add structure to global storage
			this.gameDataStructures[dataFileContent.meta.assemblage] = dataStructureForAssembly;

			// load game data template
			var GameDataObject = require('../structures/gamedata.js');
		
			// iterate through data array in the data file
			// this will create new entities in the storage based on the recognised structures
			for (var k = 0, klen = dataFileContent.data.length; k < klen; k++) {
				// fill new game data object with standard info
				var gameDataItem = new GameDataObject();
				gameDataItem.id = uuid.v1();
				gameDataItem.assemblage = dataFileContent.meta.assemblage;
				gameDataItem.components = this.gameAssemblages[dataFileContent.meta.assemblage].components;
						
				// transform the raw data into the component based structure
				var gameDataObject = this.transformData(dataFileContent.data[k], dataStructureForAssembly);
				gameDataItem.data = gameDataObject;
			
				// push new item on game data array
				storageHandler.set(gameDataItem.id, gameDataItem);
				
				// game object done
				logHandler.log(gameDataItem, 0);
			}
		}

		logHandler.log('Game data imported', 1);
	}

	// transform given raw data into the given component based structure
	transformData(rawData, dataStructure) {
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
}

// export default new GamedatahandlerClass();
var gamedataHandler = new GamedatahandlerClass();
module.exports = gamedataHandler;