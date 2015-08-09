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

console.log("# Starting game server");

// io server and interface
var io = require('socket.io');
var serverSocket;

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
	// loading game data
	gamedataHandler.loadData();
	console.log("# Game data loaded");
	
	process.exit();
	
	// set up Socket.IO to listen on port 8000
	serverSocket = io.listen(serverConfiguration.connectionPort);
	console.log("# Game server is now listening");
	
	sessionHandler.ioSession = serverSocket;

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
	serverSocket.sockets.on("connection", onSocketConnection);
};

// new socket connection
function onSocketConnection(client) {
	// new client has connected
	onClientConnect(client);

	// listen for client disconnected
	client.on("disconnect", onClientDisconnect);
	
	// proper event message was sent to the server  
	client.on('event', onEventReceived);
};

// socket client has connected
function onClientConnect(client) {
	console.log("# New client has connected: " + client.id);

	// send connect event
	var event = eventHandler.createEventObject("session", "connect", "");
	eventHandler.executeEvent(client, event);
}

// socket client has disconnected
// this = socket client
function onClientDisconnect() {
    console.log('# Client has disconnected: ' + this.id);

	// send disconnection event
	var event = eventHandler.createEventObject("session", "disconnect", "");
	eventHandler.executeEvent(this, event);
};

// socket has received message from client
// this = socket client
// msg = message string
function onEventReceived(eventString) {
    console.log('# Event received ' + eventString + " from client " + this.id);

	// parse event
	var event = eventHandler.parseEventFromString(eventString);

	// execute event
	eventHandler.executeEvent(this, event);
}


// ################################################
// run game server
// ################################################
init();