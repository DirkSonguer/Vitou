# Game server configuration

The configuration file /configuration.json in the server root contains definitions for the individual behaviour of the server.

## Server

* connectionPort: The port the game server is listening for clients
* activeModules: Array that contains the server modules that are active
* gameDirectory: The directory the game modules are located
* gameDataDirectory: The directory the components, assemblages and data are located

## Lobby

* minParticipants: Defines the number of minimum players a lobby needs to have to start a game
* maxParticipants: Defines the maximum amount of players allowed to join one specific lobby

## Logging

* logLevel: Only log items are shown beyond the level of severity that is given (0=TRACE, 1=DEBUG, 2=INFO, 3=WARN, 4=ERROR, 5=OFF)
* logTarget: Defines where to show / write logs: "CONSOLE" or "FILE"
* logFile: Filename where to write log if target = "FILE"

## Successors

An array of objects containing the if and then events. See baseic documentation for details.