# Lobby - Join Lobby

This indicates that a client wants to join the given lobby.

## Request

```javascript
{
	"module": "lobby",
	"action": "join",
	"data": "$LOBBY_ID"
}
```

## Result

All clients participating in the current lobby (including the one that just joined) will get a notification.

```javascript
{
	"module": "lobby",
	"action": "playerjoined",
	"data": "$PLAYER_ID"
}
```

## To Do

* Clients should get the full lobby state on change
* Lobby state should contain player objects, avoiding additional requests to get the data
