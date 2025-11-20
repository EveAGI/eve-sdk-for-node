import { AppwriteException, Client, type Payload } from '../client';
import { User } from './user';

export interface Video {
    id: number;
    author: User;
    play_url: string;
    cover_url: string;
    favorite_count: number;
    comment_count: number;
    is_favorite: boolean;
    title: string;
}

export class Feed {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * List Videos by Recommend
     *
     * Get recommended video feed
     *
     * @param {string} latestTime - Optional latest time for pagination
     * @param {number} actorId - Optional current user ID
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string, next_time?: number, video_list?: Video[]}>}
     */
    async listVideos(latestTime?: string, actorId?: number): Promise<{
        status_code: number;
        status_msg: string;
        next_time?: number;
        video_list?: Video[];
    }> {
        const apiPath = '/douyin/feed/';
        const payload: Payload = {};

        if (typeof latestTime !== 'undefined') {
            payload['latest_time'] = latestTime;
        }
        if (typeof actorId !== 'undefined') {
            payload['actor_id'] = actorId;
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
}

