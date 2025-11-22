# GuGoTik Node.js SDK

![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg?style=flat-square)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg?style=flat-square)

**Official Node.js SDK for GuGoTik - A TikTok-like Video Sharing Platform**

> This is the Node.js SDK for integrating with GuGoTik backend from your Node.js server-side code.

GuGoTik is a microservices-based TikTok-like video sharing platform backend developed in Go. This SDK provides a simple and intuitive interface to interact with all GuGoTik backend APIs including authentication, user management, video feed, publishing, comments, favorites, relations, and messaging.

## Features

- 🔐 **Authentication** - User login and registration
- 👤 **User Management** - Get user information, update profiles (avatar, background, signature)
- 📹 **Video Feed** - Browse recommended videos, get video by ID
- 📤 **Publishing** - Upload and publish videos, delete videos
- 💬 **Comments** - Add, delete, list, and count comments
- ❤️ **Favorites** - Like/unlike videos and manage favorites
- 👥 **Relations** - Follow/unfollow users, get followers and friends
- 💌 **Messaging** - Send and receive direct messages
- 📁 **File Storage** - Upload images directly for avatars and backgrounds
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

#### Get User Info

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

#### Update User Profile

```javascript
const { UserService } = require('gugotik-sdk');

const userService = new UserService(client);

try {
    const response = await userService.updateProfile(
        123,                                    // userId
        'token',                                // Authentication token
        'https://example.com/avatar.jpg',       // avatar (optional)
        'https://example.com/background.jpg',   // backgroundImage (optional)
        'Hello, I am a GuGoTik user!'          // signature (optional)
    );
    console.log('Profile updated:', response);
} catch (error) {
    console.error('Failed to update profile:', error);
}
```

### Video Feed

#### List Videos

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

#### Get Video By ID

```javascript
const { Feed } = require('gugotik-sdk');

const feed = new Feed(client);

try {
    const response = await feed.getVideoById(
        456,    // videoId
        123     // actorId (optional)
    );
    console.log('Video details:', response.video);
} catch (error) {
    console.error('Failed to get video:', error);
}
```

### Publishing Videos

#### Publish a Video

The SDK uses **multipart/form-data** (FormData) to upload videos to the backend. The video file and title are sent in the form body, while authentication parameters (token and actor_id) are sent as query parameters.

```javascript
const { Publish } = require('gugotik-sdk');
const fs = require('fs');

const publish = new Publish(client);

try {
    const videoData = fs.readFileSync('video.mp4');

    const response = await publish.publishVideo(
        123,        // actorId
        'token',    // Authentication token
        videoData,  // Video file data (Buffer, Blob, or File)
        'My Video'  // Video title
    );
    console.log('Video published:', response);
} catch (error) {
    console.error('Failed to publish video:', error);
}
```

**How it works:**
- The SDK automatically converts Buffer/Blob to File for FormData compatibility
- Query parameters: `token`, `actor_id`
- Form body fields: `data` (video file), `title` (video title)
- Content-Type: `multipart/form-data` (automatically set by the SDK)

#### Publish a Video with Chunked Upload and Progress Tracking

For large video files (>5MB), the SDK automatically uses chunked upload. You can also track upload progress:

```javascript
const { Publish } = require('gugotik-sdk');
const fs = require('fs');

const publish = new Publish(client);

try {
    const videoData = fs.readFileSync('large-video.mp4');

    const response = await publish.publishVideo(
        123,        // actorId
        'token',    // Authentication token
        videoData,  // Video file data
        'My Video', // Video title
        (progress) => {
            // Progress callback
            console.log(`Upload progress: ${progress.progress}%`);
            console.log(`Uploaded: ${progress.sizeUploaded} bytes`);
            console.log(`Chunks: ${progress.chunksUploaded}/${progress.chunksTotal}`);
        }
    );
    console.log('Video published:', response);
} catch (error) {
    console.error('Failed to publish video:', error);
}
```

**Features:**
- Uses **FormData** for multipart/form-data uploads
- Automatic chunked upload for files larger than 5MB (configurable via `Client.CHUNK_SIZE`)
- Backend support for chunked uploads with Redis-based temporary storage
- Progress tracking with detailed upload statistics from both client and server
- Supports Buffer, Blob, and File types
- Automatic retry and resume capability through chunk-based uploads
- Query parameters and form body fields are properly separated
- Server returns `upload_id`, `chunks_total`, and `chunks_uploaded` for progress tracking

**How Chunked Upload Works:**
1. SDK splits large files into 5MB chunks
2. Each chunk is sent with a `Content-Range` header (e.g., `bytes 0-5242879/10485760`)
3. Backend stores chunks temporarily in Redis with 1-hour expiration
4. Backend tracks upload progress and returns `upload_id` for subsequent chunks
5. When all chunks are received, backend assembles them and creates the video
6. Chunks are automatically cleaned up from Redis after successful assembly

#### Delete a Video

```javascript
const { Publish } = require('gugotik-sdk');

const publish = new Publish(client);

try {
    const response = await publish.deleteVideo(
        123,      // actorId (must be video owner)
        456,      // videoId
        'token'   // Authentication token
    );
    console.log('Video deleted:', response);
} catch (error) {
    console.error('Failed to delete video:', error);
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

### File Storage

Upload images directly to GuGoTik storage:

```javascript
const { GuGoTikStorage } = require('gugotik-sdk');
const fs = require('fs');

const storage = new GuGoTikStorage(client);

try {
    const imageData = fs.readFileSync('avatar.jpg');

    const response = await storage.uploadFile(imageData);
    console.log('File uploaded:', response.file_url);
    // Use the file_url for user avatar, background image, etc.
} catch (error) {
    console.error('Failed to upload file:', error);
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
- **UserService** - User management (get user info, update profile)
- **Feed** - Video feed (list videos, get video by ID)
- **Publish** - Video publishing (publish video, delete video, list published videos)
- **CommentService** - Comment management
- **Favorite** - Like/favorite videos
- **Relation** - Follow/unfollow users
- **MessageService** - Direct messaging
- **GuGoTikStorage** - File storage (upload images)

For detailed API documentation, see the [GuGoTik Backend Documentation](https://github.com/GuGoTik/backend).

## Learn More

- 📖 [GuGoTik Backend Repository](https://github.com/GuGoTik/backend)
- 🏗️ [Architecture Documentation](https://github.com/GuGoTik/backend/blob/main/README.md)
- 🐛 [Report Issues](https://github.com/GuGoTik/backend/issues)

## Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Please see the [BSD-3-Clause license](LICENSE) file for more information.