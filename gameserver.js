// *************************************************** //
// Game server proof of concept 
//
// This script is the main file that is given to node
// to start the game server. It will start up and
// listen to input events send by a connected client.
//
// Note that all general configuration data iscan be
// found in ./configuration.json.
//
// Also note: This is a proof of concept. If you use
// this thing in any way productive, you should get
// your head examined! See README for details.
// *************************************************** //

// io server and interface
var io = require('socket.io');
var serverSocket;

// log handler
var logHandler = require('./classes/loghandler.js');

// configuration handler
var configurationHandler = require('./classes/configurationhandler.js');

// session handler
var sessionHandler = require('./classes/sessionhandler.js');

// event handler
var eventHandler = require('./classes/eventhandler.js');

// game data handler
var gamedataHandler = require('./classes/gamedatahandler.js');

// general server configuration
var fileSystem = require('fs');
var serverConfiguration = JSON.parse(fileSystem.readFileSync('./configuration.json'));

// ################################################
// initialise game server
// ################################################

function init() {
	// load configuration
	configurationHandler.loadConfiguration();
	logHandler.log('Starting game server', 2);
	
	// loading game data
	gamedataHandler.loadData();
	logHandler.log('Game data loaded', 2);
	
	// set up Socket.IO to listen on port 8000
	serverSocket = io.listen(configurationHandler.configurationStorage.server.connectionPort);
	sessionHandler.ioSession = serverSocket;
	logHandler.log('Game server is now listening', 2);

	// start listening for events
	setEventHandlers();
};


// ################################################
// socket input handling
// note - this only handles connect, disconnect
// and general message input. The actual message
// processing will be handled by the message
// handler (= queue).
// ################################################

var setEventHandlers = function () {
	// socket.IO
	serverSocket.sockets.on('connection', onSocketConnection);
};

// new socket connection
function onSocketConnection(client) {
	// new client has connected
	onClientConnect(client);

	// listen for client disconnected
	client.on('disconnect', onClientDisconnect);
	
	// proper event message was sent to the server  
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

	// parse event
	var event = eventHandler.parseEventFromString(eventString);

	// execute event
	eventHandler.executeEvent(this, event);
}


// ################################################
// run game server
// ################################################
init();