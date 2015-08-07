# Lobby - Create Lobby

Request from the client to create a new lobby with the calling client as first participant.

## Request

```javascript
{
	"module": "lobby",
	"action": "create",
	"data": ""
}
```

## Result

The server will answer with the id of the newly created lobby.

```javascript
{
	"module": "lobby",
	"action": "created",
	"data": "$NEW_LOBBY_ID"
}

## To Do

* Clients should get the full lobby state on change
