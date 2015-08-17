// *************************************************** //
// Storagehandler class
//
// This script acts as the global storage.
// Basically a super simple key / value database.
// Usually you should use something like Redis or
// another storage / cache, but this class acts as
// a simple in-storage database for this PoC.
// *************************************************** //

// log handler
var logHandler = require('./loghandler.js');

var storageHandler = new StoragehandlerClass();

// class function that gets the prototype methods
function StoragehandlerClass() {
	this.dataStorage = new Array();
}

// store a new data item
StoragehandlerClass.prototype.set = function (key, value) {
	logHandler.log('Storing data for key ' + key, 0);

	// add object to storage	
	this.dataStorage[key] = value;

	// done
	return true;
}

// retrieve a data item
StoragehandlerClass.prototype.get = function (key) {
	logHandler.log('Retrieving data for key ' + key, 0);

	// return object from storage	
	return this.dataStorage[key];
}

// retrieve all data items with a specific property
StoragehandlerClass.prototype.getByProperty = function (property, key) {
	logHandler.log('Retrieving data that has property ' + property + '=' + key, 0);
	
	// create return object
	var returnData = new Array();
	
	// this is appallingly ineffective
	var allKeys = Object.keys(this.dataStorage);
	for (var i = 0, len = allKeys.length; i < len; i++) {
		var el = this.dataStorage[allKeys[i]];
		if (el[property] == key) {
			returnData.push(el);
		}
	}
	
	// return objects from storage	
	return returnData;
}

// check if a data item exists
StoragehandlerClass.prototype.exists = function (key) {
	logHandler.log('Checking if data exists for key ' + key, 0);

	// if item exists, it's not undefined
	if (typeof this.dataStorage[key] === 'undefined') {
		return false;
	}
	
	// done
	return true;
}

// delete a data item
StoragehandlerClass.prototype.delete = function (key) {
	logHandler.log('Deleting data with key ' + key, 0);

	// remove object from storage
	delete this.dataStorage[key];

	// done
	return true;
}

module.exports = storageHandler;