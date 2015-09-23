# Chat - Message

The client sends a chat message to the server. The message will then be broadcasted to the given client.

## Request

```javascript
{
	"type": "system",
	"module": "chat",
	"action": "message",
	"data": "$CHAT_OBJECT"
}
```

The chat object consists of the user id of the recipient and the actual chat message.

```javascript
{
	"to": "$USER_ID",
	"message": "$CHAT_MESSAGE"
}
```

## Result

The server will send a message to the respective client.

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