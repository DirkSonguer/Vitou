
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