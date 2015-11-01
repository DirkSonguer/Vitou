// *************************************************** //
// Configurationhandler class
//
// This script takes care of loading and providing the
// general configuration.
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

var fileSystem = require('fs');
var filePath = require('path');

class ConfigurationhandlerClass {
    constructor() {
        this.configurationStorage = {};
    }

    loadConfiguration() {
        // load general server configuration
        var configurationFilePath = filePath.join(__dirname, '/../' + 'configuration.json');
        this.configurationStorage = JSON.parse(fileSystem.readFileSync(configurationFilePath));

        // done
        return true;
    }
}

// export default new ConfigurationhandlerClass();
var configurationHandler = new ConfigurationhandlerClass();
module.exports = configurationHandler;