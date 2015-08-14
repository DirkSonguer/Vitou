# Session - Disconnect -> Destroy Session

A client wants to end the session.

Note that the socket connection will be closed after this.

## Request

```javascript
{
	"type": "system",
	"module": "session",
	"action": "disconnect",
	"data": ""
}
```

## Result

The server will answer with the id of the destroyed (old) session.

```javascript
{
	"module": "session",
	"action": "disconnected",
	"data": "$SESSION_ID"
}

## To Do

