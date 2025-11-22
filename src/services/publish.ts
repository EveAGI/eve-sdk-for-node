import { AppwriteException, Client, type Payload, type UploadProgress } from '../client';
import { Video } from './feed';
import { FormData, File } from 'node-fetch-native-with-agent';

export class Publish {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Publish Video
     *
     * Upload and publish a new video with support for chunked uploads
     *
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @param {Buffer | Blob | File} data - Video file data
     * @param {string} title - Video title
     * @param {(progress: UploadProgress) => void} onProgress - Optional callback for upload progress
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string}>}
     */
    async publishVideo(
        actorId: number,
        token: string,
        data: Buffer | Blob | File,
        title: string,
        onProgress?: (progress: UploadProgress) => void
    ): Promise<{
        status_code: number;
        status_msg: string;
    }> {
        if (typeof actorId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "actorId"');
        }
        if (typeof token === 'undefined') {
            throw new AppwriteException('Missing required parameter: "token"');
        }
        if (typeof data === 'undefined') {
            throw new AppwriteException('Missing required parameter: "data"');
        }
        if (typeof title === 'undefined') {
            throw new AppwriteException('Missing required parameter: "title"');
        }

        const apiPath = '/douyin/publish/action/';
        const payload: Payload = {};

        payload['actor_id'] = actorId;
        payload['token'] = token;
        payload['title'] = title;

        // Convert Buffer or Blob to File for chunked upload support
        let fileData: File;
        if (data instanceof File) {
            fileData = data;
        } else if (data instanceof Blob) {
            fileData = new File([data], 'video.mp4', { type: 'video/mp4' });
        } else if (Buffer.isBuffer(data)) {
            // Convert Buffer to Uint8Array for Blob compatibility
            const uint8Array = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            const blob = new Blob([uint8Array], { type: 'video/mp4' });
            fileData = new File([blob], 'video.mp4', { type: 'video/mp4' });
        } else {
            throw new AppwriteException('Invalid data type. Expected Buffer, Blob, or File');
        }

        payload['data'] = fileData;

        const uri = new URL(this.client.config.endpoint + apiPath);

        const apiHeaders: { [header: string]: string } = {
            'content-type': 'multipart/form-data',
        };

        // Use chunkedUpload if file is large or if progress callback is provided
        if (fileData.size > Client.CHUNK_SIZE || onProgress) {
            return this.client.chunkedUpload(
                'post',
                uri,
                apiHeaders,
                payload,
                onProgress || (() => {})
            );
        }

        // For small files, use regular upload
        return this.client.call(
            'post',
            uri,
            apiHeaders,
            payload,
        );
    }

    /**
     * List Published Videos
     *
     * Get list of videos published by a user
     *
     * @param {number} userId - User ID whose videos to list
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string, video_list: Video[]}>}
     */
    async listPublishedVideos(userId: number, actorId: number, token: string): Promise<{
        status_code: number;
        status_msg: string;
        video_list: Video[];
    }> {
        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }
        if (typeof actorId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "actorId"');
        }
        if (typeof token === 'undefined') {
            throw new AppwriteException('Missing required parameter: "token"');
        }

        const apiPath = '/douyin/publish/list/';
        const payload: Payload = {};

        payload['user_id'] = userId;
        payload['actor_id'] = actorId;
        payload['token'] = token;

        const uri = new URL(this.client.config.endpoint + apiPath);
        Object.keys(payload).forEach(key => uri.searchParams.append(key, payload[key]));

        const apiHeaders: { [header: string]: string } = {
            'content-type': 'application/json',
        };

        return this.client.call(
            'get',
            uri,
            apiHeaders,
            {},
        );
    }

    /**
     * Delete Video
     *
     * Delete a video by its ID (owner only)
     *
     * @param {number} actorId - Current user ID (must be video owner)
     * @param {number} videoId - Video ID to delete
     * @param {string} token - Authentication token
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string}>}
     */
    async deleteVideo(actorId: number, videoId: number, token: string): Promise<{
        status_code: number;
        status_msg: string;
    }> {
        if (typeof actorId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "actorId"');
        }
        if (typeof videoId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "videoId"');
        }
        if (typeof token === 'undefined') {
            throw new AppwriteException('Missing required parameter: "token"');
        }

        const apiPath = '/douyin/publish/action/';
        const payload: Payload = {};

        payload['actor_id'] = actorId;
        payload['video_id'] = videoId;
        payload['token'] = token;

        const uri = new URL(this.client.config.endpoint + apiPath);
        Object.keys(payload).forEach(key => uri.searchParams.append(key, payload[key]));

        const apiHeaders: { [header: string]: string } = {
            'content-type': 'application/json',
        };

        return this.client.call(
            'delete',
            uri,
            apiHeaders,
            {},
        );
    }
}

