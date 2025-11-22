/**
 * GuGoTik SDK - Chunked Upload Example
 * 
 * This example demonstrates how to use the chunked upload feature
 * for publishing large video files with progress tracking.
 */

const { Client, Publish } = require('gugotik-sdk');
const fs = require('fs');
const path = require('path');

// Initialize the client
const client = new Client();
client
    .setEndpoint('http://localhost:37000') // Your GuGoTik backend endpoint
    .setToken('your-auth-token-here');     // Set authentication token

const publish = new Publish(client);

/**
 * Example 1: Basic chunked upload with progress tracking
 */
async function uploadVideoWithProgress() {
    console.log('📹 Starting video upload with progress tracking...\n');

    const videoPath = path.join(__dirname, 'sample-video.mp4');
    const videoData = fs.readFileSync(videoPath);
    const videoStats = fs.statSync(videoPath);
    
    console.log(`File size: ${(videoStats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Chunk size: ${(Client.CHUNK_SIZE / 1024 / 1024).toFixed(2)} MB\n`);

    try {
        const response = await publish.publishVideo(
            123,                    // actorId
            'your-token',          // token
            videoData,             // video data
            'My Awesome Video',    // title
            (progress) => {
                // Progress callback - called for each chunk uploaded
                const progressBar = createProgressBar(progress.progress);
                const uploadedMB = (progress.sizeUploaded / 1024 / 1024).toFixed(2);
                const totalMB = (videoStats.size / 1024 / 1024).toFixed(2);
                
                console.log(`${progressBar} ${progress.progress}%`);
                console.log(`Uploaded: ${uploadedMB} MB / ${totalMB} MB`);
                console.log(`Chunks: ${progress.chunksUploaded}/${progress.chunksTotal}\n`);
            }
        );

        console.log('✅ Video uploaded successfully!');
        console.log('Response:', response);
    } catch (error) {
        console.error('❌ Upload failed:', error.message);
    }
}

/**
 * Example 2: Upload with custom progress UI
 */
async function uploadWithCustomProgress() {
    const videoPath = path.join(__dirname, 'large-video.mp4');
    const videoData = fs.readFileSync(videoPath);
    
    let startTime = Date.now();
    let lastProgress = 0;

    try {
        const response = await publish.publishVideo(
            123,
            'your-token',
            videoData,
            'Large Video Upload',
            (progress) => {
                const currentTime = Date.now();
                const elapsedSeconds = (currentTime - startTime) / 1000;
                const uploadSpeed = progress.sizeUploaded / elapsedSeconds / 1024 / 1024; // MB/s
                const progressDelta = progress.progress - lastProgress;
                
                console.clear();
                console.log('╔════════════════════════════════════════╗');
                console.log('║       Video Upload Progress           ║');
                console.log('╠════════════════════════════════════════╣');
                console.log(`║ Progress: ${progress.progress}%`.padEnd(41) + '║');
                console.log(`║ Uploaded: ${(progress.sizeUploaded / 1024 / 1024).toFixed(2)} MB`.padEnd(41) + '║');
                console.log(`║ Speed: ${uploadSpeed.toFixed(2)} MB/s`.padEnd(41) + '║');
                console.log(`║ Chunks: ${progress.chunksUploaded}/${progress.chunksTotal}`.padEnd(41) + '║');
                console.log(`║ Time: ${elapsedSeconds.toFixed(1)}s`.padEnd(41) + '║');
                console.log('╚════════════════════════════════════════╝');
                
                lastProgress = progress.progress;
            }
        );

        console.log('\n✅ Upload completed successfully!');
        return response;
    } catch (error) {
        console.error('\n❌ Upload failed:', error.message);
        throw error;
    }
}

/**
 * Example 3: Upload multiple videos with progress tracking
 */
async function uploadMultipleVideos(videoPaths) {
    console.log(`📹 Uploading ${videoPaths.length} videos...\n`);

    for (let i = 0; i < videoPaths.length; i++) {
        const videoPath = videoPaths[i];
        const videoName = path.basename(videoPath);
        
        console.log(`\n[${i + 1}/${videoPaths.length}] Uploading: ${videoName}`);
        
        const videoData = fs.readFileSync(videoPath);
        
        try {
            await publish.publishVideo(
                123,
                'your-token',
                videoData,
                `Video ${i + 1}`,
                (progress) => {
                    process.stdout.write(`\r${createProgressBar(progress.progress)} ${progress.progress}%`);
                }
            );
            
            console.log('\n✅ Uploaded successfully!');
        } catch (error) {
            console.error(`\n❌ Failed to upload ${videoName}:`, error.message);
        }
    }
}

/**
 * Helper function to create a progress bar
 */
function createProgressBar(percentage, length = 30) {
    const filled = Math.round((percentage / 100) * length);
    const empty = length - filled;
    return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
}

// Run examples
async function main() {
    console.log('🚀 GuGoTik SDK - Chunked Upload Examples\n');
    
    // Uncomment the example you want to run:
    
    // await uploadVideoWithProgress();
    // await uploadWithCustomProgress();
    // await uploadMultipleVideos(['video1.mp4', 'video2.mp4', 'video3.mp4']);
}

main().catch(console.error);

