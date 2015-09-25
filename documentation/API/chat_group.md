# Chat - Group

The client sends a chat message to the server. The message will then be broadcasted to the given clients.

## Request

```javascript
{
	"type": "system",
	"module": "chat",
	"action": "message",
	"data": "$CHAT_OBJECT"
}
```

The chat object consists of an array of user ids for the recipients as well as the actual chat message.

```javascript
{
	"to": ["$USER_ID"],
	"message": "$CHAT_MESSAGE"
}
```

## Result

The server will send a message to the respective clients.

```javascript
{
	"module": "chat",
	"action": "message",
	"data": "$CHAT_OBJECT"
}
```

The chat object itself consists of the user id of the sender (or the string "anonymous") and the actual chat message.

```javascript
{
	"from": "$USER_ID_OR_ANONYMOUS",
	"message": "$CHAT_MESSAGE"
}
```