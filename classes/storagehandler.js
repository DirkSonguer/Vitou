// *************************************************** //
// Storagehandler class
//
// This script acts as the global storage.
// Basically a super simple key / value database.
// Usually you should use something like Redis or
// another storage / cache, but this class acts as
// an in-storage database for this PoC.
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

// log handler
var logHandler = require('./loghandler.js');

class StoragehandlerClass {
    constructor() {
		this.dataStorage = new Map();
	}
	
	// store a new data item
	set(key, value) {
		logHandler.log('Storing data for key ' + key, 0);

		// add object to storage	
		this.dataStorage.set(key, value);

		// done
		return true;
	}

	// retrieve a data item
	get(key) {
		logHandler.log('Retrieving data for key ' + key, 0);

		// get actual value
		let returnData = this.dataStorage.get(key);

		if ((typeof returnData == 'object') && (returnData.type != 'SessionObject')) {
			returnData = (JSON.parse(JSON.stringify(returnData)));
		}

		// return object from storage	
		return returnData;
	}

	// retrieve all data items with a specific property
	getByProperty(property, value) {
		logHandler.log('Retrieving data that has property ' + property + '=' + value, 0);
	
		// create return object
		let returnData = new Array();

		// iterate through all data objects
		let dataItem = new Map();
		for (dataItem of this.dataStorage.values()) {
			if (dataItem[property] == value) {
				returnData.push(dataItem);
			}
		}

		// return objects from storage	
		return returnData;
	}

	// check if a data item exists
	exists(key) {
		logHandler.log('Checking if data exists for key ' + key, 0);
	
		// done
		return this.dataStorage.has(key);
	}

	// delete a data item
	delete(key) {
		logHandler.log('Deleting data with key ' + key, 0);

		// remove object from storage
		this.dataStorage.delete(key);

		// done
		return true;
	}
}

// export default new StoragehandlerClass();
var storageHandler = new StoragehandlerClass();
module.exports = storageHandler;