
// *************************************************** //
// Entityhandler class
//
// This script handles everything around entites.
// *************************************************** //


// UUID
var uuid = require('node-uuid');

// file system
var fileSystem = require('fs');
var filePath = require('path');

var ecsHandler = new EntityComponentSystemClass();

// Class function that gets the prototype methods
function EntityComponentSystemClass() {
	this.entityStorage = new Array();
	this.componentStorage = new Array();
}

// create a new identity
// the entity gets pre-attached components via a given assemblage
// the components are filled with data from the data pool
EntityComponentSystemClass.prototype.createEntity = function (assemblage, data) {

	// done
	return true;
}

// destroy given entity
EntityComponentSystemClass.prototype.destroyEntity = function (entityId) {

	// done
	return true;
}

// add an assemblage to an existing identity
// note: this will overwrite data if components are duplicated
// the entity gets pre-attached components via a given assemblage
// the components are filled with data from the data pool
EntityComponentSystemClass.prototype.addAssemblageToEntity = function (assemblage, entity, data) {

	// done
	return true;
}

// load a given assemblage into an object
EntityComponentSystemClass.prototype.getStructureForAssemblage = function (assemblage) {

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
EntityComponentSystemClass.prototype.getStructureForComponent = function (component) {

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

// load data for a given component type into an component object
EntityComponentSystemClass.prototype.getDataForComponent = function (dataFile, dataIndex, component) {

	// build path to component source file
	var dataSourcePath = filePath.join(__dirname, '/../data/gamesdata/' + dataFile + '.json');

	// checking if the component actually exists in the system
	try {
		var stat = fileSystem.statSync(dataSourcePath);
		if (!stat.isFile()) {
			console.log("# Data file does not exist: " + dataSourcePath + " not found (Not a file)");
			return false;
		}
	} catch (e) {
		console.log("# Data file does not exist: " + dataSourcePath + " not found (" + e.code + ")");
		return false;
	}
	
	// TODO: WTFCACHING!
	
	// load component data from file system
	var dataSource = JSON.parse(fileSystem.readFileSync(dataSourcePath, 'utf8'));
	
	// get data from index
	var dataObject = dataSource[dataIndex];
	
	// done
	return dataObject;
}


// Reference object for a game
function EntityObject() {
	// entity id for referencing
	this.id = "";
}

module.exports = ecsHandler;