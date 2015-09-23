# User - Get State

This is used by the client to retrieve the current state and data for a logged in user.

Note that this only returns the user data for the user the client session is bound to, so it can't retrieve data from other users.

## Request

```javascript
{
	"type": "system",
	"module": "user",
	"action": "getstate",
	"data": ""
}
```

## Result

The server will answer with the object of the respective user.

```javascript
{
	"module": "user",
	"action": "state",
	"data": "$USER_OBJECT"
}
```

## To Do

