
var run = function (sender, data) {
	// check if data is available
	if (!data) {
		// no data 
		return false;
	}
	
	// broadcast data
	sender.broadcast.emit('message', data);
	sender.emit('message', data);

	// done		
	return true;
};

module.exports = run;