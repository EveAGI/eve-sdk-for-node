import { AppwriteException, Client, type Payload } from '../client';
import { User } from './user';

export class Relation {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Follow User
     *
     * Follow a user
     *
     * @param {number} userId - User ID to follow
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string}>}
     */
    async follow(userId: number, actorId: number, token: string): Promise<{
        status_code: number;
        status_msg: string;
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

        const apiPath = '/douyin/relation/follow/';
        const payload: Payload = {};

        payload['to_user_id'] = userId;
        payload['actor_id'] = actorId;
        payload['token'] = token;

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
     * Unfollow User
     *
     * Unfollow a user
     *
     * @param {number} userId - User ID to unfollow
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string}>}
     */
    async unfollow(userId: number, actorId: number, token: string): Promise<{
        status_code: number;
        status_msg: string;
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

        const apiPath = '/douyin/relation/unfollow/';
        const payload: Payload = {};

        payload['to_user_id'] = userId;
        payload['actor_id'] = actorId;
        payload['token'] = token;

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
     * Get Follow List
     *
     * Get list of users that a user is following
     *
     * @param {number} userId - User ID
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string, user_list: User[]}>}
     */
    async getFollowList(userId: number, actorId: number, token: string): Promise<{
        status_code: number;
        status_msg: string;
        user_list: User[];
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

        const apiPath = '/douyin/relation/follow/list/';
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
     * Get Follower List
     *
     * Get list of users following a user
     *
     * @param {number} userId - User ID
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string, user_list: User[]}>}
     */
    async getFollowerList(userId: number, actorId: number, token: string): Promise<{
        status_code: number;
        status_msg: string;
        user_list: User[];
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

        const apiPath = '/douyin/relation/follower/list/';
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
     * Get Friend List
     *
     * Get list of mutual friends
     *
     * @param {number} userId - User ID
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string, user_list: User[]}>}
     */
    async getFriendList(userId: number, actorId: number, token: string): Promise<{
        status_code: number;
        status_msg: string;
        user_list: User[];
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

        const apiPath = '/douyin/relation/friend/list/';
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
     * Check if Following
     *
     * Check if current user is following another user
     *
     * @param {number} userId - User ID to check
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @throws {AppwriteException}
     * @returns {Promise<{result: boolean}>}
     */
    async isFollowing(userId: number, actorId: number, token: string): Promise<{
        result: boolean;
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

        const apiPath = '/douyin/relation/isFollow/';
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

