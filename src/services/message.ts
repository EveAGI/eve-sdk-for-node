import { AppwriteException, Client, type Payload } from '../client';

export interface Message {
    id: number;
    content: string;
    create_time: number;
    from_user_id?: number;
    to_user_id?: number;
}

export class MessageService {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Send Message
     *
     * Send a message to another user
     *
     * @param {number} toUserId - Recipient user ID
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @param {string} content - Message content
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string}>}
     */
    async sendMessage(toUserId: number, actorId: number, token: string, content: string): Promise<{
        status_code: number;
        status_msg: string;
    }> {
        if (typeof toUserId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "toUserId"');
        }
        if (typeof actorId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "actorId"');
        }
        if (typeof token === 'undefined') {
            throw new AppwriteException('Missing required parameter: "token"');
        }
        if (typeof content === 'undefined') {
            throw new AppwriteException('Missing required parameter: "content"');
        }

        const apiPath = '/douyin/message/action/';
        const payload: Payload = {};

        payload['to_user_id'] = toUserId;
        payload['actor_id'] = actorId;
        payload['token'] = token;
        payload['action_type'] = 1;
        payload['content'] = content;

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
     * List Messages
     *
     * Get chat messages between two users
     *
     * @param {number} toUserId - Other user ID
     * @param {number} actorId - Current user ID
     * @param {string} token - Authentication token
     * @param {number} preMsgTime - Optional previous message time for pagination
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string, message_list: Message[]}>}
     */
    async listMessages(toUserId: number, actorId: number, token: string, preMsgTime?: number): Promise<{
        status_code: number;
        status_msg: string;
        message_list: Message[];
    }> {
        if (typeof toUserId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "toUserId"');
        }
        if (typeof actorId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "actorId"');
        }
        if (typeof token === 'undefined') {
            throw new AppwriteException('Missing required parameter: "token"');
        }

        const apiPath = '/douyin/message/chat/';
        const payload: Payload = {};

        payload['to_user_id'] = toUserId;
        payload['actor_id'] = actorId;
        payload['token'] = token;
        if (typeof preMsgTime !== 'undefined') {
            payload['pre_msg_time'] = preMsgTime;
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

