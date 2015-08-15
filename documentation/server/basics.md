# Game server basics

This document explains how the game server and it's core components works.

## Basic assumptions

The game server was developed based on a couple of design assumptions:

* A developer should not need to change the core server code, but only write code related to his specific game
* Game specific code should be so simple that it can be easily auto generated by other GUI-based UIs.
* Data structures should be super simple to define
* Game based data should be super simple to import

## How the server "thinks"

The server works as one big event handler. You trigger something, it does something. It does not run on his own, does not have a "tick", does do anything without an external trigger.

The notation of each input event is: type + module + action + data.

* Type: This identifies the general recepient of the event. The event can be directed to the server itself ("system") or either one of the defined games within the configuration.
* Module: A module in Node is basically a logical cluster of actions. This server behaves accordingly, although the implementation does not follow the Node packaging, but modules are simply implemented as directories containing code files.
* Action: The actual code snippet that is run on event. This is a single file within the module directory.
* Data: Additional data for the event if needed as JSON object.

## Available modules + actions

### Session module

For each connected client, a session is automatically created on connection. The session is also automatically destroyed once a player disconnects. That means that a connection drop / reconnect will get a new, clean session. Any data you had in your session is gone, so store your permanent data either in the user objects or game objects, depending on where you need them!

The session module provides the following actions:

* connect: This is implicitly called by the game server once a client connects.
* disconnect: This is also implicitly called by the game server once a client disconnects, but can also be explicitly called by a client to end his game session.

### User module

Users are permanent objects so you can store user related data in a permanent way (remember: sessions are not). This should mostly be used for game related meta data like overall points, wins, trophies etc, but also for personal data like name, email, profile picture etc.

Note that the user object does not impose any structure on the meta data, so your game has to take care of validating it.

The session module provides the following actions:

* create: Creates a new user in permanent storage. Note that the user is automatially authenticated for this session.
* authenticate: Authenticate a user against a session. This allows a session to be bound to an existing user (pretty much a login).
* delete: Deletes a user object form permanent storage.

### Lobby module

The game server provides simple lobby handling capabilities. This does not include automated matchmaking, but merely provide an old-school approach like "one player creates a lobby, other join, if all confirm, then the game starts". If you want matchmaking, your game can use the lobby system as a baseline to work on top of that.

The lobby module provides the following actions:

* create: Creates a new lobby. Note that the user that created the lobby is automatically in the lobby.
* list: Get a list of all currently open lobbies.
* join: Join an existing lobby.
* leave: Leave a lobby you are participating in.
* confirm: Confirm that you are ready to start the game.

Note that if all players in a lobby have confirmed that they are ready, a new game is created automatically.

### Game module

The game module within the core server does only provide very basic actions for a game, basically only creating and destorying games as well as adding sessions to a game. All game-related actions are handled in the actual game directory.

Note that there are different actions to create a game from scratch or via a lobby.

The game module provides the following actions:

* create: Creates a new game.
* destroy: Destroys an existing game.
* addsession: Adds a session to an existing game.

### Chat module

The game server provides simple chat functionalities.

The chat module provides the following actions:

* broadcast: Send a message to every connected session
* group: Send a message to a set of given sessions
* private: Send a message to one specific session

## Successors

The game server allows chaining of actions as dynamic successory, which are defined in the server configuration file. This way hard-coded chains are avoided and the developer can extend the core actions with game specific actions. One example would be the initialisation with game-specific data once a new player connects to a game.

Generally a successor is executed after a defined event, basically creating an if-then chain of actions. A new successor can be added to the game by adding it in the ./configuration.json in the successors-section.

Here is an example how to add a successor, defined as type/module/action. This executes game->successors->ongamecreated after system->game->create is finsihed. Note that the return value of the if-action is handed to the then-action as data and not the origintal data values.

```javascript
    { "if": "system/game/create", "then": "game/successors/ongamecreated" }
```

Note that each event can _only have one successor_. Oh, and be careful not to create infinite loops with this (A succeeds B which succeeds A).

## How the server handles game data

The server handles game data as small collections of data elements called components. Each component should represent a capability of an object that inherits this component. An example component could be "CanMove" while the elements within the component might describe how the object can move (speed, vector etc.).

```javascript
{
	"meta":{
		"comment":"An object can move with a given speed"
	},
	"data":{
		"speed":0
	}
}
```

Then there are assemblages, which act as templates for objects, aggregating a number of components into logical types. An example would be the type "tank", which might contain the components "CanMove", "HasArmor", "CanAttack" and so on.

```javascript
{
	"meta":{
		"comment":"A tank in the game"
	},
	"data":[
		"HasNameComponent",
		"HitboxComponent",
		"HitpointComponent",
		"PositionComponent",
		"CanMoveComponent",
		"PriceComponent"
	]
}
```

The component approach allows you to act based on capabilities of objects, cross-cutting through conventional object structures. In that sense it acts as a very dynamic multiple-inheritance approach.

Then there is the actual game data, as defined in data files. While assemblages act as the object structures, the game data files contain individual data items for specific assemblages. Each data file will be loaded on startup as instances of their respective assemblage. For example a data file might contain 10 definitions for tanks that are then available in the game. This is usually used to define sets of in-game items, units etc.

```javascript
{
	"meta":{
		"assemblage":"tank"
	},
	"data":[
		["Brutus",10,100,0,0,5,1000],
		["Spike",5,40,0,0,8,1200],
		["Tower",20,220,0,0,2,800]
	]
}
```