# GuGoTik Node.js SDK

![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg?style=flat-square)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg?style=flat-square)

**Official Node.js SDK for GuGoTik - A TikTok-like Video Sharing Platform**

> This is the Node.js SDK for integrating with GuGoTik backend from your Node.js server-side code.

GuGoTik is a microservices-based TikTok-like video sharing platform backend developed in Go. This SDK provides a simple and intuitive interface to interact with all GuGoTik backend APIs including authentication, user management, video feed, publishing, comments, favorites, relations, and messaging.

## Features

- 🔐 **Authentication** - User login and registration
- 👤 **User Management** - Get user information and profiles
- 📹 **Video Feed** - Browse recommended videos
- 📤 **Publishing** - Upload and publish videos
- 💬 **Comments** - Add, delete, list, and count comments
- ❤️ **Favorites** - Like/unlike videos and manage favorites
- 👥 **Relations** - Follow/unfollow users, get followers and friends
- 💌 **Messaging** - Send and receive direct messages
- 🎯 **TypeScript Support** - Full TypeScript definitions included

## Installation

To install via [NPM](https://www.npmjs.com/):

```bash
npm install gugotik-sdk --save
```

Or with Yarn:

```bash
yarn add gugotik-sdk
```

## Getting Started

### Initialize the SDK

Initialize your SDK with your GuGoTik backend endpoint (default: `http://localhost:37000`):

```javascript
const { Client, Auth } = require('gugotik-sdk');

const client = new Client();

client
    .setEndpoint('http://localhost:37000') // Your GuGoTik backend endpoint
    .setSelfSigned(true); // Use only in dev mode with self-signed SSL cert
```

### Authentication

#### Register a New User

```javascript
const { Client, Auth } = require('gugotik-sdk');

const client = new Client()
    .setEndpoint('http://localhost:37000');

const auth = new Auth(client);

try {
    const response = await auth.register('username', 'password');
    console.log('User registered:', response);
    // Response: { status_code: 0, status_msg: 'success', user_id: 123, token: 'xxx' }

    // Set token for authenticated requests
    client.setToken(response.token);
} catch (error) {
    console.error('Registration failed:', error);
}
```

#### Login

```javascript
const { Client, Auth } = require('gugotik-sdk');

const client = new Client()
    .setEndpoint('http://localhost:37000');

const auth = new Auth(client);

try {
    const response = await auth.login('username', 'password');
    console.log('Login successful:', response);
    // Response: { status_code: 0, status_msg: 'success', user_id: 123, token: 'xxx' }

    // Set token for authenticated requests
    client.setToken(response.token);
} catch (error) {
    console.error('Login failed:', error);
}
```

### User Management

```javascript
const { UserService } = require('gugotik-sdk');

const userService = new UserService(client);

try {
    const user = await userService.getUser(
        123,      // userId - User to query
        456,      // actorId - Current user
        'token'   // Authentication token
    );
    console.log('User info:', user);
} catch (error) {
    console.error('Failed to get user:', error);
}
```

### Video Feed

```javascript
const { Feed } = require('gugotik-sdk');

const feed = new Feed(client);

try {
    const videos = await feed.listVideos(
        undefined,  // latestTime (optional)
        123         // actorId (optional)
    );
    console.log('Video feed:', videos.video_list);
} catch (error) {
    console.error('Failed to get feed:', error);
}
```

### Publishing Videos

```javascript
const { Publish } = require('gugotik-sdk');
const fs = require('fs');

const publish = new Publish(client);

try {
    const videoData = fs.readFileSync('video.mp4');

    const response = await publish.publishVideo(
        123,        // actorId
        'token',    // Authentication token
        videoData,  // Video file data
        'My Video'  // Video title
    );
    console.log('Video published:', response);
} catch (error) {
    console.error('Failed to publish video:', error);
}
```

### Comments

```javascript
const { CommentService } = require('gugotik-sdk');

const commentService = new CommentService(client);

// Add a comment
try {
    const comment = await commentService.addComment(
        456,              // videoId
        123,              // actorId
        'token',          // Authentication token
        'Great video!'    // Comment text
    );
    console.log('Comment added:', comment);
} catch (error) {
    console.error('Failed to add comment:', error);
}

// List comments
try {
    const comments = await commentService.listComments(456, 123, 'token');
    console.log('Comments:', comments.comment_list);
} catch (error) {
    console.error('Failed to list comments:', error);
}
```

### Favorites

```javascript
const { Favorite } = require('gugotik-sdk');

const favorite = new Favorite(client);

// Like a video
try {
    await favorite.likeVideo(456, 123, 'token');
    console.log('Video liked');
} catch (error) {
    console.error('Failed to like video:', error);
}

// List favorite videos
try {
    const favorites = await favorite.listFavorites(123, 123, 'token');
    console.log('Favorite videos:', favorites.video_list);
} catch (error) {
    console.error('Failed to list favorites:', error);
}
```

### Relations (Follow/Unfollow)

```javascript
const { Relation } = require('gugotik-sdk');

const relation = new Relation(client);

// Follow a user
try {
    await relation.follow(789, 123, 'token');
    console.log('User followed');
} catch (error) {
    console.error('Failed to follow user:', error);
}

// Get followers
try {
    const followers = await relation.getFollowerList(123, 123, 'token');
    console.log('Followers:', followers.user_list);
} catch (error) {
    console.error('Failed to get followers:', error);
}

// Check if following
try {
    const isFollowing = await relation.isFollowing(789, 123, 'token');
    console.log('Is following:', isFollowing.result);
} catch (error) {
    console.error('Failed to check follow status:', error);
}
```

### Messaging

```javascript
const { MessageService } = require('gugotik-sdk');

const messageService = new MessageService(client);

// Send a message
try {
    await messageService.sendMessage(
        789,              // toUserId
        123,              // actorId
        'token',          // Authentication token
        'Hello there!'    // Message content
    );
    console.log('Message sent');
} catch (error) {
    console.error('Failed to send message:', error);
}

// List messages
try {
    const messages = await messageService.listMessages(789, 123, 'token');
    console.log('Messages:', messages.message_list);
} catch (error) {
    console.error('Failed to list messages:', error);
}
```

## Error Handling

The SDK raises `AppwriteException` with `message`, `code`, `type`, and `response` properties. Handle errors appropriately:

```javascript
const { Auth, AppwriteException } = require('gugotik-sdk');

const auth = new Auth(client);

try {
    const response = await auth.login('username', 'password');
    console.log('Login successful:', response);
} catch (error) {
    if (error instanceof AppwriteException) {
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error response:', error.response);
    } else {
        console.error('Unexpected error:', error);
    }
}
```

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions:

```typescript
import { Client, Auth, Feed, Video, User } from 'gugotik-sdk';

const client = new Client()
    .setEndpoint('http://localhost:37000');

const auth = new Auth(client);
const feed = new Feed(client);

// Full type safety
const loginResponse = await auth.login('username', 'password');
const videos = await feed.listVideos();

videos.video_list?.forEach((video: Video) => {
    console.log(`Video: ${video.title} by ${video.author.name}`);
});
```

## API Reference

### Services

- **Auth** - User authentication (login, register)
- **UserService** - User management
- **Feed** - Video feed
- **Publish** - Video publishing
- **CommentService** - Comment management
- **Favorite** - Like/favorite videos
- **Relation** - Follow/unfollow users
- **MessageService** - Direct messaging

For detailed API documentation, see the [GuGoTik Backend Documentation](https://github.com/GuGoTik/backend).

## Learn More

- 📖 [GuGoTik Backend Repository](https://github.com/GuGoTik/backend)
- 🏗️ [Architecture Documentation](https://github.com/GuGoTik/backend/blob/main/README.md)
- 🐛 [Report Issues](https://github.com/GuGoTik/backend/issues)

## Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Please see the [BSD-3-Clause license](LICENSE) file for more information.