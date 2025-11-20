import { AppwriteException, Client, type Payload } from '../client';
import { Video } from './feed';

export class Favorite {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Like Video
     *
     * Like/favorite a video
     *
     * @param {number} videoId - Video ID
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string}>}
     */
    async likeVideo(videoId: number, actorId: number, token: string): Promise<{
        status_code: number;
        status_msg: string;
    }> {
        if (typeof videoId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "videoId"');
        }
        if (typeof actorId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "actorId"');
        }
        if (typeof token === 'undefined') {
            throw new AppwriteException('Missing required parameter: "token"');
        }

        const apiPath = '/douyin/favorite/action/';
        const payload: Payload = {};

        payload['video_id'] = videoId;
        payload['actor_id'] = actorId;
        payload['token'] = token;
        payload['action_type'] = 1;

        const uri = new URL(this.client.config.endpoint + apiPath);

        const apiHeaders: { [header: string]: string } = {
            'content-type': 'application/x-www-form-urlencoded',
        };

        return this.client.call(
            'post',
            uri,
            apiHeaders,
            payload,
        );
    }

    /**
     * Unlike Video
     *
     * Unlike/unfavorite a video
     *
     * @param {number} videoId - Video ID
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string}>}
     */
    async unlikeVideo(videoId: number, actorId: number, token: string): Promise<{
        status_code: number;
        status_msg: string;
    }> {
        if (typeof videoId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "videoId"');
        }
        if (typeof actorId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "actorId"');
        }
        if (typeof token === 'undefined') {
            throw new AppwriteException('Missing required parameter: "token"');
        }

        const apiPath = '/douyin/favorite/action/';
        const payload: Payload = {};

        payload['video_id'] = videoId;
        payload['actor_id'] = actorId;
        payload['token'] = token;
        payload['action_type'] = 2;

        const uri = new URL(this.client.config.endpoint + apiPath);

        const apiHeaders: { [header: string]: string } = {
            'content-type': 'application/x-www-form-urlencoded',
        };

        return this.client.call(
            'post',
            uri,
            apiHeaders,
            payload,
        );
    }

    /**
     * List Favorite Videos
     *
     * Get list of videos favorited by a user
     *
     * @param {number} userId - User ID whose favorites to list
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string, video_list: Video[]}>}
     */
    async listFavorites(userId: number, actorId: number, token: string): Promise<{
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

        const apiPath = '/douyin/favorite/list/';
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
}

