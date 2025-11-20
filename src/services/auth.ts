import { AppwriteException, Client, type Payload } from '../client';

export class Auth {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * User Login
     *
     * Login with username and password
     *
     * @param {string} username - Username
     * @param {string} password - Password
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string, user_id: number, token: string}>}
     */
    async login(username: string, password: string): Promise<{
        status_code: number;
        status_msg: string;
        user_id: number;
        token: string;
    }> {
        if (typeof username === 'undefined') {
            throw new AppwriteException('Missing required parameter: "username"');
        }
        if (typeof password === 'undefined') {
            throw new AppwriteException('Missing required parameter: "password"');
        }

        const apiPath = '/douyin/user/login/';
        const payload: Payload = {};

        if (typeof username !== 'undefined') {
            payload['username'] = username;
        }
        if (typeof password !== 'undefined') {
            payload['password'] = password;
        }

        const uri = new URL(this.client.config.endpoint + apiPath + '?username=' + username + '&password=' + password);

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
     * User Register
     *
     * Register a new user account
     *
     * @param {string} username - Username (max 32 characters)
     * @param {string} password - Password (max 32 characters)
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string, user_id: number, token: string}>}
     */
    async register(username: string, password: string): Promise<{
        status_code: number;
        status_msg: string;
        user_id: number;
        token: string;
    }> {
        if (typeof username === 'undefined') {
            throw new AppwriteException('Missing required parameter: "username"');
        }
        if (typeof password === 'undefined') {
            throw new AppwriteException('Missing required parameter: "password"');
        }

        const apiPath = '/douyin/user/register/';
        const payload: Payload = {};

        if (typeof username !== 'undefined') {
            payload['username'] = username;
        }
        if (typeof password !== 'undefined') {
            payload['password'] = password;
        }

        const uri = new URL(this.client.config.endpoint + apiPath + '?username=' + username + '&password=' + password);

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
}

