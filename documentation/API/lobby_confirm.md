# Lobby - Confirm Lobby

This indicates that a client that is part of a lobby confirms the respective game confiugration.

Note that this will spawn a new game once all participants in the lobby have confirmed.

## Request

```javascript
{
	"type": "system",
	"module": "lobby",
	"action": "confirm",
	"data": "$LOBBY_ID"
}
```

## Result

All clients participating in the current lobby will get a notification that the player confirmed.

```javascript
{
	"module": "lobby",
	"action": "playerconfirmed",
	"data": "$PLAYER_ID"
}
```

If all players in the lobby have confirmed, a new game will start and an update will be sent to all clients.

```javascript
{
	"module": "lobby",
	"action": "lobbyclosed",
	"data": "$LOBBY_ID"
}
```

and

```javascript
{
	"module": "game",
	"action": "gamecreated",
	"data": "$NEW_GAME_ID"
}
```

## To Do

* Clients should get the full game state on game creation
* Game state should contain player objects, avoiding additional requests to get the data
