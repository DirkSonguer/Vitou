# Session - Connect -> Create Session

First connection of an unknown client to the server. The client will get a new session object for further communication.

Note that while the action can be called explicitly by the client, it will be implicitly called once a new client will connect with another request.

## Request

```javascript
{
	"type": "system",
	"module": "session",
	"action": "connect",
	"data": ""
}
```

## Result

The server will answer with the id of the newly created session.

```javascript
{
	"module": "session",
	"action": "created",
	"data": "$SESSION_ID"
}

## To Do

* Clients should get the full session state
