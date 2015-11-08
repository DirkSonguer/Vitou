# User - Authenticate User

This will authenticate a user, acting as a login. If successful it will bind an existing user to the current client session. 

Note that no proper authentication and user handling is implemented, so you just hand over a user id and if it exists, it's bound to the client session.

## Request

```javascript
{
	"type": "system",
	"module": "user",
	"action": "authenticate",
	"data": "$USER_ID"
}
```

## Result

The server will answer with the object of the user that is now bound to the session.

```javascript
{
	"module": "user",
	"action": "authenticated",
	"data": "$USER_OBJECT"
}
```

## To Do
