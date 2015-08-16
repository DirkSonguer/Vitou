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
	this.dataStorage = {};
}

// store a new data item
StoragehandlerClass.prototype.store = function (key, value) {
	logHandler.log('Storing data for key ' + key, 0);
	
	// yes, that's pretty much it
	this.dataStorage[key] = value;

	// done
	return true;
}

// retrieve a data item
StoragehandlerClass.prototype.retrieve = function (key) {
	logHandler.log('Retrieving data for key ' + key, 0);

	// yes, that's pretty much it
	return this.dataStorage[key];
}

// check if a data item exists
StoragehandlerClass.prototype.exists = function (key) {
	logHandler.log('Checking if data exists for key ' + key, 0);

	// yes, that's pretty much it
	if (typeof this.dataStorage[key] === 'undefined') {
		return false;
	}
	
	// done
	return true;
}

// delete a data item
StoragehandlerClass.prototype.delete = function (key) {
	logHandler.log('Deleting data with key ' + key, 0);

	// yes, that's pretty much it
	delete this.dataStorage[key];

	// done
	return true;
}

module.exports = storageHandler;