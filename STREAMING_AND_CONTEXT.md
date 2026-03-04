# Conversation History & Streaming Setup

## Features Implemented

### 1. ✅ Conversation Context Storage
- All messages (user and assistant) are automatically stored in Firestore
- Each new message includes the full conversation history
- Gemini can reference previous messages when responding
- Users don't need to repeat context between messages
- Conversation is personalized to each user

### 2. ✅ Character Streaming from Gemini
- Responses stream character-by-character in real-time
- No more waiting for the complete response
- Improved user experience with instant visual feedback
- API uses Server-Sent Events (SSE) for streaming

## How It Works

### Conversation Context Flow

```
1. User sends message
   ↓
2. Message stored in Firestore with user ID
   ↓
3. Retrieve last 50 messages from Firestore (conversation history)
   ↓
4. Send message + history to Gemini API
   ↓
5. Gemini responds with understanding of full context
   ↓
6. Stream response character by character to user
   ↓
7. Store complete response in Firestore
```

### Streaming Process

```
Frontend:
1. Send request with conversation history
2. Open EventSource reader
3. Listen for "data: {content: chunk}" events
4. Update message in real-time as chunks arrive
5. Close when "done: true" event received

Backend:
1. Build messages array with conversation history
2. Call Gemini generateContentStream()
3. For each chunk from Gemini stream:
   - Send as Server-Sent Event (SSE) to client
4. After stream complete:
   - Store full response in Firestore
   - Send done event
```

## Database Structure (Firestore)

### conversations collection

```javascript
{
  id: "auto-generated-doc-id",
  userID: "firebase-auth-user-id",
  role: "user" | "assistant",
  content: "message text content",
  timestamp: Timestamp,
  uploadedFile: null | "filename.pdf"
}
```

### Firestore Security Rules

Add these rules to enable proper access control:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow users to access their own messages
    match /conversations/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userID;
      allow create: if request.auth.uid == request.resource.data.userID;
    }
  }
}
```

To apply these rules:
1. Go to Firebase Console → Firestore → Rules
2. Replace with the rules above
3. Click Publish

## Implementation Details

### API Endpoint (`/api/chat`)

**Request:**
```json
{
  "message": "user message text",
  "userID": "firebase-auth-user-id",
  "uploadedFile": "filename.pdf | null",
  "conversationHistory": [
    {
      "role": "user",
      "content": "previous message"
    },
    {
      "role": "assistant",
      "content": "previous response"
    }
  ]
}
```

**Response (Server-Sent Events):**
```
data: {"content": "character or word chunk"}
data: {"content": " more text"}
...
data: {"done": true}
```

### Files Changed

1. **lib/conversationService.ts** (NEW)
   - `storeMessage()` - Save messages to Firestore
   - `getConversationHistory()` - Retrieve user's conversation
   - `formatMessagesForGemini()` - Convert history to Gemini format

2. **app/api/chat/route.ts** (UPDATED)
   - Now accepts user ID and conversation history
   - Uses `generateContentStream()` instead of `generateContent()`
   - Returns readable stream with Server-Sent Events
   - Stores both user and assistant messages in Firestore

3. **app/chat/page.tsx** (UPDATED)
   - Loads conversation history on component mount
   - Handles streaming responses in real-time
   - Sends conversation history with each message
   - Updates message content as chunks arrive

## Benefits

### For Users
✨ **Natural Conversations**
- Bot remembers previous messages and context
- No need to repeat information
- More coherent and contextual responses

⚡ **Real-time Response**
- See answers appearing instantly
- Don't wait for full response generation
- Improved perceived performance

💾 **Persistent History**
- Conversation saved across sessions
- Can pick up where they left off
- Full audit trail of interactions

### For Developers
🔧 **Easy Integration**
- Simple service functions for conversation management
- Streaming handled automatically
- Firebase integration ready

📊 **Better Analytics**
- All interactions logged in Firestore
- User engagement tracking
- Response quality assurance

🔐 **Secure by Default**
- Messages only accessible to the user
- Firebase security rules enforced
- Authentication required

## Testing the Features

### Test Conversation Context
1. Ask a question: "What is the budget for education in 2024?"
2. Ask a follow-up: "Compare that to health spending"
3. Notice the bot references your first question without you repeating it

### Test Streaming
1. Ask a question: "List 10 Nigerian government agencies"
2. Notice the response appears character by character
3. You can read along as it's being generated

### Test Persistence
1. Ask a question in chat
2. Refresh the page (Ctrl+R)
3. Your entire conversation history is loaded
4. The bot remembers all previous messages

## Troubleshooting

### Messages Not Being Stored
- Check Firebase auth is working (test with login)
- Verify Firestore is enabled in Firebase Console
- Check browser console for errors
- Ensure `.env.local` has correct Firebase credentials

### Streaming Not Working
- Check network tab in browser dev tools
- Look for "text/event-stream" responses
- Verify API returns proper SSE format
- Check server logs for errors

### Conversation History Not Loading
- Ensure user is authenticated
- Check Firestore has data in "conversations" collection
- Verify security rules allow read access
- Check browser console for Firestore errors

### Performance Issues
- Consider increasing `messageLimit` in `getConversationHistory()` (default: 20)
- Monitor Firestore read/write operations
- Use Firestore indexes for large collections

## Future Enhancements

- [ ] Search conversation history
- [ ] Export/download conversations
- [ ] Delete specific messages
- [ ] Mark conversations as favorites
- [ ] Conversation naming/organization
- [ ] Real-time collaboration (multi-user)
- [ ] Response regeneration option
- [ ] Sentiment analysis on conversations

## Related Documentation

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Google Gemini Streaming](https://ai.google.dev/tutorials/rest_quickstart)
- [Server-Sent Events (SSE)](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [Next.js Streaming Responses](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming)
