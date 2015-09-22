
# Vitou

This is a proof of concept for a game server middleware. Proof of concept means: It is a really, really bad idea to use this thing in any way productive. For example it only runs in memory. There is no data storage attached and if it crashes, all is gone. Also, there is no real security and it's full of things that will affect performance in a very, very bad way. And there is no queueing. In other words I tried to add TODOs as a blacklist but gave up since there would be too many. Got it?

The game server was developed based on a couple of design assumptions:

* The core server provides most of the "metagame" related functionalities
* A developer should not need to change the core server code, but only write code related to his specific game
* Game specific code should be so simple that it can be easily auto generated by other GUI-based UIs
* Data structures should be super simple to define
* Game based data should be super simple to import

The name does not mean anything, it was randomly created by a phonetic password generator. I was fed up calling the thing just "gameserver" all the time.

# Vitou projects

* Vitou server: https://github.com/DirkSonguer/Vitou
* Vitou example game: https://github.com/DirkSonguer/Vitou-examplegame
* Vitou UI: https://github.com/DirkSonguer/Vitou-ui

## Installation

### Prerequisites

* Get node.js: https://nodejs.org/download/
* Change in the project root and get all dependencies with "npm install"

### Run servers

* "node ./vitou.js" in project root runs the game server 

See server documentation in /documentation/server.

## How to use as client

The calls to the server revolves around modules, actions and data, handed over in a JSON object.

{
	"type": "STRING",
	"module": "STRING",
	"action": "STRING",
	"data": "STRING"
};

The type defines if the event is for the game server itself ("system") or the game ("game"). The module defines the directory within /server_modules or /game_modules (depending on type), the action defines the file to call. Data describes what is handed over to the function.

Example: { "type": "system", "module": "lobby", "action": "joinlobby", "data": "a86c3760-3a05-11e5-a155-fd6757717cdb" };

A similar structure is also send back to the client, but without the type. Yes, lazy. Will change. Maybe.

See API documentation in /documentation/API.
