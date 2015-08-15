# User - Create User

This creates a new user and adds it to the storage. The current session will be bound to the new user, basically acting as an automatic authentication.

## Request

```javascript
{
	"type": "system",
	"module": "user",
	"action": "create",
	"data": ""
}
```

## Result

The server will answer with the id of the newly created user.

```javascript
{
	"module": "user",
	"action": "created",
	"data": "$USER_ID"
}
```

## To Do

