import { AppwriteException, Client, type Payload } from '../client';

export interface User {
    id: number;
    name: string;
    follow_count?: number;
    follower_count?: number;
    is_follow: boolean;
    avatar?: string;
    background_image?: string;
    signature?: string;
    total_favorited?: number;
    work_count?: number;
    favorite_count?: number;
}

export class UserService {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Get User Info
     *
     * Get user information by user ID
     *
     * @param {number} userId - User ID to query
     * @param {number} actorId - Current logged in user ID
     * @param {string} token - Authentication token
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string, user: User}>}
     */
    async getUser(userId: number, actorId: number, token: string): Promise<{
        status_code: number;
        status_msg: string;
        user: User;
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

        const apiPath = '/douyin/user/';
        const payload: Payload = {};

        if (typeof userId !== 'undefined') {
            payload['user_id'] = userId;
        }
        if (typeof actorId !== 'undefined') {
            payload['actor_id'] = actorId;
        }
        if (typeof token !== 'undefined') {
            payload['token'] = token;
        }

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
     * Update User Profile
     *
     * Update user profile information (avatar, background image, signature)
     *
     * @param {number} userId - User ID to update
     * @param {string} token - Authentication token
     * @param {string} avatar - Optional avatar URL
     * @param {string} backgroundImage - Optional background image URL
     * @param {string} signature - Optional user signature/bio
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string}>}
     */
    async updateProfile(
        userId: number,
        token: string,
        avatar?: string,
        backgroundImage?: string,
        signature?: string
    ): Promise<{
        status_code: number;
        status_msg: string;
    }> {
        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }
        if (typeof token === 'undefined') {
            throw new AppwriteException('Missing required parameter: "token"');
        }

        const apiPath = '/douyin/user/profile/';
        const payload: Payload = {};

        payload['user_id'] = userId;
        payload['token'] = token;

        if (typeof avatar !== 'undefined') {
            payload['avatar'] = avatar;
        }
        if (typeof backgroundImage !== 'undefined') {
            payload['background_image'] = backgroundImage;
        }
        if (typeof signature !== 'undefined') {
            payload['signature'] = signature;
        }

        const uri = new URL(this.client.config.endpoint + apiPath);

        const apiHeaders: { [header: string]: string } = {
            'content-type': 'application/json',
        };

        return this.client.call(
            'put',
            uri,
            apiHeaders,
            payload,
        );
    }
}

