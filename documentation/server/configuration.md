# game server configuration

The condiguration file /configuration.json in the server root contains definitions for the individual behaviour of the server.

## Server

* connectionPort: The port the game server is listening for clients

## Lobby

* minPlayers: Defines the number of minimum players a lobby needs to have to start a game
* maxPlayers: Defines the maximum amount of players allowed to join one specific lobby

## Logging

* logLevel: Only log items are shown beyond the level of severity that is given (0=TRACE, 1=DEBUG, 2=INFO, 3=WARN, 4=ERROR, 5=OFF)
* logTarget: Defines where to show / write logs: "CONSOLE" or "FILE"
* logFile: Filename where to write log if target = "FILE"