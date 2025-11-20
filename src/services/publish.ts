import { AppwriteException, Client, type Payload } from '../client';
import { Video } from './feed';

export class Publish {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Publish Video
     *
     * Upload and publish a new video
     *
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @param {Buffer | Blob} data - Video file data
     * @param {string} title - Video title
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string}>}
     */
    async publishVideo(actorId: number, token: string, data: Buffer | Blob, title: string): Promise<{
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
        payload['data'] = data;

        const uri = new URL(this.client.config.endpoint + apiPath);

        const apiHeaders: { [header: string]: string } = {
            'content-type': 'multipart/form-data',
        };

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

