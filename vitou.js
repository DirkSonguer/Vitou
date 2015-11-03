// *************************************************** //
// Vitou proof of concept 
//
// This script is the main file that is given to node
// to start the Vitou game server. It will start up
// and listen to input events send by a connected client.
//
// Note that all general configuration data can be
// found in ./configuration.json.
//
// Also note: This is a proof of concept. If you use
// this thing in any way productive, you should get
// your head examined! See README.md for details.
//
// Author: Dirk Songuer
// License: CC BY-NC 3.0
// License: https://creativecommons.org/licenses/by-nc/3.0
// *************************************************** //

// io server and interface
var io = require('socket.io');
var serverSocket;

// log handler
var logHandler = require('./classes/loghandler.js');

// configuration handler
var configurationHandler = require('./classes/configurationhandler.js');

// event handler
var eventHandler = require('./classes/eventhandler.js');

// game data handler
var gamedataHandler = require('./classes/gamedatahandler.js');

// initialise game server
function init() {
	// load configuration
	configurationHandler.loadConfiguration();
	
	// with the configuration loaded, we can actually start loading everything else
	logHandler.log('Starting game server', 2);
	
	// loading game data
	// this means that every instance of the game server loads the data by itself and keeps it in its memory
	// that means data changes for one server in-memory will not affect other, newly created instances
	gamedataHandler.loadData();
	
	// set up Socket.IO to listen on defined port
	serverSocket = io.listen(configurationHandler.configurationStorage.server.connectionPort);
	logHandler.log('Game server is now listening on port ' + configurationHandler.configurationStorage.server.connectionPort, 2);

	// start listening for events
	setEventHandlers();
};


// socket input handling
// note - this only handles connect, disconnect
// and general message input. The actual message
// processing will be handled by the message
// handler (= queue).
var setEventHandlers = function () {
	// socket.IO
	serverSocket.sockets.on('connection', onSocketConnection);
};

// new socket connection occured
// note that there are only 3 relevant things to listen for:
// the actual connect, the the disconnect and events
function onSocketConnection(client) {
	// new client has connected
	onClientConnect(client);

	// listen for client disconnect
	client.on('disconnect', onClientDisconnect);
	
	// proper event message was sent to the server
	// this is sent to the event handler
	client.on('event', onEventReceived);
};

// socket client has connected
function onClientConnect(client) {
	logHandler.log('New client has connected: ' + client.id, 1);

	// send connect event
	var event = eventHandler.createEventObject('system', 'session', 'connect', '');
	eventHandler.executeEvent(client, event);
}

// socket client has disconnected
// this = socket client
function onClientDisconnect() {
	logHandler.log('Client has disconnected: ' + this.id, 1);

	// send disconnection event
	var event = eventHandler.createEventObject('system', 'session', 'disconnect', '');
	eventHandler.executeEvent(this, event);
};

// socket has received message from client
// this = socket client
// msg = message string
function onEventReceived(eventString) {
	logHandler.log('Event received ' + eventString + ' from client ' + this.id, 0);

	// execute event
	var event = eventHandler.parseEventFromString(eventString);
	eventHandler.executeEvent(this, event);
}

// run game server
init();