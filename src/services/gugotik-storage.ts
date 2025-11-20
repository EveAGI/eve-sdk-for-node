import { AppwriteException, Client, type Payload } from '../client';

export class GuGoTikStorage {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Upload File
     *
     * Upload an image file directly to GuGoTik storage
     *
     * @param {Buffer | Blob | File} file - Image file to upload
     * @throws {AppwriteException}
     * @returns {Promise<{status_code: number, status_msg: string, file_url?: string}>}
     */
    async uploadFile(file: Buffer | Blob | File): Promise<{
        status_code: number;
        status_msg: string;
        file_url?: string;
    }> {
        if (typeof file === 'undefined') {
            throw new AppwriteException('Missing required parameter: "file"');
        }

        const apiPath = '/douyin/storage/upload/';
        const payload: Payload = {};

        payload['file'] = file;

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
}

