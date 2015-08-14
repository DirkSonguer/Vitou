# Chat - Broadcast

The client sends a chat message to the server. The message will then be broadcasted to all attached clients.

## Request

```javascript
{
	"type": "system",
	"module": "chat",
	"action": "sendmessage",
	"data": "$CHAT_MESSAGE"
}
```

## Result

The server will send a message to all attached clients.

```javascript
{
	"module": "chat",
	"action": "message",
	"data": "$CHAT_MESSAGE"
}
```
