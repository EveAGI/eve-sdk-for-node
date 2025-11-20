import { AppwriteException, Client, type Payload } from '../client';
import { User } from './user';

export interface Comment {
    id: number;
    user: User;
    content: string;
    create_date: string;
}

export class CommentService {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Add Comment
     *
     * Add a comment to a video
     *
     * @param {number} videoId - Video ID
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @param {string} commentText - Comment content
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string, comment: Comment}>}
     */
    async addComment(videoId: number, actorId: number, token: string, commentText: string): Promise<{
        status_code: number;
        status_msg: string;
        comment: Comment;
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
        if (typeof commentText === 'undefined') {
            throw new AppwriteException('Missing required parameter: "commentText"');
        }

        const apiPath = `/douyin/comment/${videoId}/`;
        const payload: Payload = {};

        payload['video_id'] = videoId;
        payload['actor_id'] = actorId;
        payload['token'] = token;
        payload['action_type'] = 1;
        payload['comment_text'] = commentText;

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
     * Delete Comment
     *
     * Delete a comment from a video
     *
     * @param {number} videoId - Video ID
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @param {number} commentId - Comment ID to delete
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string}>}
     */
    async deleteComment(videoId: number, actorId: number, token: string, commentId: number): Promise<{
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
        if (typeof commentId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "commentId"');
        }

        const apiPath = `/douyin/comment/${videoId}/`;
        const payload: Payload = {};

        payload['video_id'] = videoId;
        payload['actor_id'] = actorId;
        payload['token'] = token;
        payload['action_type'] = 2;
        payload['comment_id'] = commentId;

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
     * List Comments
     *
     * Get list of comments for a video
     *
     * @param {number} videoId - Video ID
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string, comment_list: Comment[]}>}
     */
    async listComments(videoId: number, actorId: number, token: string): Promise<{
        status_code: number;
        status_msg: string;
        comment_list: Comment[];
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

        const apiPath = `/douyin/comment/${videoId}/list/`;
        const payload: Payload = {};

        payload['video_id'] = videoId;
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
     * Count Comments
     *
     * Get comment count for a video
     *
     * @param {number} videoId - Video ID
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string, comment_count: number}>}
     */
    async countComments(videoId: number, actorId: number, token: string): Promise<{
        status_code: number;
        status_msg: string;
        comment_count: number;
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

        const apiPath = `/douyin/comment/${videoId}/count/`;
        const payload: Payload = {};

        payload['video_id'] = videoId;
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

