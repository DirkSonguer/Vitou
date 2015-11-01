// *************************************************** //
// Game data structure
//
// This structure reflects game data within the system.
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

// reference object for a dame data item
function GameDataObject() {
	// object type
	this.type = 'GameDataObject';

	// game data id for referencing
	this.id = '';

	// contains the assemblage for the data item
	this.assemblage = '';

	// contains the components for the data item
	this.components = new Array();

	// contains the actual data
	this.data = {};
}

module.exports = GameDataObject;