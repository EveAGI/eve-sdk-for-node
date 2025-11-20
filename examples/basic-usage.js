/**
 * GuGoTik SDK Basic Usage Example
 * 
 * This example demonstrates how to use the GuGoTik Node.js SDK
 * to interact with the GuGoTik backend API.
 */

const { Client, Auth, UserService, Feed, Publish, CommentService, Favorite, Relation, MessageService, GuGoTikStorage } = require('../dist/index.js');

// Initialize the client
const client = new Client();
client
    .setEndpoint('http://localhost:37000')  // Your GuGoTik backend endpoint
    .setSelfSigned(true);                   // Use only in dev mode with self-signed SSL cert

// Example 1: User Registration
async function registerUser() {
    const auth = new Auth(client);
    
    try {
        const response = await auth.register('testuser', 'password123');
        console.log('✅ User registered successfully:', response);
        
        // Set token for authenticated requests
        client.setToken(response.token);
        
        return response;
    } catch (error) {
        console.error('❌ Registration failed:', error.message);
    }
}

// Example 2: User Login
async function loginUser() {
    const auth = new Auth(client);
    
    try {
        const response = await auth.login('testuser', 'password123');
        console.log('✅ Login successful:', response);
        
        // Set token for authenticated requests
        client.setToken(response.token);
        
        return response;
    } catch (error) {
        console.error('❌ Login failed:', error.message);
    }
}

// Example 3: Get User Information
async function getUserInfo(userId, actorId, token) {
    const userService = new UserService(client);
    
    try {
        const user = await userService.getUser(userId, actorId, token);
        console.log('✅ User info retrieved:', user);
        return user;
    } catch (error) {
        console.error('❌ Failed to get user info:', error.message);
    }
}

// Example 4: Get Video Feed
async function getVideoFeed(actorId) {
    const feed = new Feed(client);
    
    try {
        const videos = await feed.listVideos(undefined, actorId);
        console.log('✅ Video feed retrieved:', videos.video_list?.length, 'videos');
        return videos;
    } catch (error) {
        console.error('❌ Failed to get video feed:', error.message);
    }
}

// Example 5: Like a Video
async function likeVideo(videoId, actorId, token) {
    const favorite = new Favorite(client);
    
    try {
        await favorite.likeVideo(videoId, actorId, token);
        console.log('✅ Video liked successfully');
    } catch (error) {
        console.error('❌ Failed to like video:', error.message);
    }
}

// Example 6: Add a Comment
async function addComment(videoId, actorId, token, commentText) {
    const commentService = new CommentService(client);
    
    try {
        const comment = await commentService.addComment(videoId, actorId, token, commentText);
        console.log('✅ Comment added:', comment);
        return comment;
    } catch (error) {
        console.error('❌ Failed to add comment:', error.message);
    }
}

// Example 7: Follow a User
async function followUser(userId, actorId, token) {
    const relation = new Relation(client);
    
    try {
        await relation.follow(userId, actorId, token);
        console.log('✅ User followed successfully');
    } catch (error) {
        console.error('❌ Failed to follow user:', error.message);
    }
}

// Example 8: Send a Message
async function sendMessage(toUserId, actorId, token, content) {
    const messageService = new MessageService(client);

    try {
        await messageService.sendMessage(toUserId, actorId, token, content);
        console.log('✅ Message sent successfully');
    } catch (error) {
        console.error('❌ Failed to send message:', error.message);
    }
}

// Example 9: Update User Profile
async function updateUserProfile(userId, token, avatar, backgroundImage, signature) {
    const userService = new UserService(client);

    try {
        const response = await userService.updateProfile(userId, token, avatar, backgroundImage, signature);
        console.log('✅ Profile updated successfully:', response);
        return response;
    } catch (error) {
        console.error('❌ Failed to update profile:', error.message);
    }
}

// Example 10: Get Video By ID
async function getVideoById(videoId, actorId) {
    const feed = new Feed(client);

    try {
        const response = await feed.getVideoById(videoId, actorId);
        console.log('✅ Video retrieved:', response.video);
        return response;
    } catch (error) {
        console.error('❌ Failed to get video:', error.message);
    }
}

// Example 11: Delete Video
async function deleteVideo(actorId, videoId, token) {
    const publish = new Publish(client);

    try {
        const response = await publish.deleteVideo(actorId, videoId, token);
        console.log('✅ Video deleted successfully:', response);
        return response;
    } catch (error) {
        console.error('❌ Failed to delete video:', error.message);
    }
}

// Example 12: Upload File (Image)
async function uploadFile(fileBuffer) {
    const storage = new GuGoTikStorage(client);

    try {
        const response = await storage.uploadFile(fileBuffer);
        console.log('✅ File uploaded successfully:', response.file_url);
        return response;
    } catch (error) {
        console.error('❌ Failed to upload file:', error.message);
    }
}

// Main execution
async function main() {
    console.log('🚀 GuGoTik SDK Example\n');
    
    // Register or login
    // const authResponse = await registerUser();
    
    const authResponse = await loginUser();
    if (authResponse) {
        console.log('✅ User registered/logged in successfully');
        const { user_id, token } = authResponse;
        
        // Get user info
        await getUserInfo(user_id, user_id, token);
        
        // Get video feed
        await getVideoFeed(user_id);
        
        // More examples can be added here...
    }
}

// Run the example
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
    getVideoFeed,
    likeVideo,
    addComment,
    followUser,
    sendMessage,
    updateUserProfile,
    getVideoById,
    deleteVideo,
    uploadFile
};

