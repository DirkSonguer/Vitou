# Lobby - Leave Lobby

This indicates that a client wants to leave the given lobby.

## Request

```javascript
{
	"module": "lobby",
	"action": "leave",
	"data": "$LOBBY_ID"
}
```

## Result

All remaining clients participating in the current lobby will get a notification.

```javascript
{
	"module": "lobby",
	"action": "playerleft",
	"data": "$PLAYER_ID"
}
```

## To Do

* Clients should get the full lobby state on change
* Lobby state should contain player objects, avoiding additional requests to get the data
