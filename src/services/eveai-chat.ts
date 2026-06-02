import { Client } from '../client';

/**
 * Eve.AI Chat Service
 * 
 * Real-time messaging and conversation management
 */
export class EveAIChat {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Create Conversation
     * 
     * Start a new conversation for a task
     */
    async createConversation(
        taskId: string,
        participantIds: number[]
    ): Promise<ConversationResponse> {
        const path = '/chat/conversations';
        return await this.client.call('post', path, {
            'content-type': 'application/json',
        }, {
            task_id: taskId,
            participant_ids: participantIds
        });
    }

    /**
     * Get Conversation
     * 
     * Get conversation details
     */
    async getConversation(conversationId: string): Promise<ConversationResponse> {
        const path = `/chat/conversations/${conversationId}`;
        return await this.client.call('get', path);
    }

    /**
     * List Conversations
     * 
     * List all user conversations
     */
    async listConversations(
        page: number = 1,
        pageSize: number = 20
    ): Promise<ConversationListResponse> {
        const path = '/chat/conversations';
        return await this.client.call('get', path, {}, {
            page,
            page_size: pageSize
        });
    }

    /**
     * Send Message
     * 
     * Send a chat message
     */
    async sendMessage(
        conversationId: string,
        content: string,
        type: string = 'text',
        metadata?: any
    ): Promise<MessageResponse> {
        const path = `/chat/conversations/${conversationId}/messages`;
        return await this.client.call('post', path, {
            'content-type': 'application/json',
        }, {
            content,
            type,
            metadata
        });
    }

    /**
     * Get Messages
     * 
     * Get messages for a conversation
     */
    async getMessages(
        conversationId: string,
        page: number = 1,
        pageSize: number = 50
    ): Promise<MessageListResponse> {
        const path = `/chat/conversations/${conversationId}/messages`;
        return await this.client.call('get', path, {}, {
            page,
            page_size: pageSize
        });
    }

    /**
     * Mark as Read
     * 
     * Mark messages as read
     */
    async markAsRead(
        conversationId: string,
        messageIds: string[]
    ): Promise<StatusResponse> {
        const path = `/chat/conversations/${conversationId}/read`;
        return await this.client.call('post', path, {
            'content-type': 'application/json',
        }, {
            message_ids: messageIds
        });
    }

    /**
     * Get Unread Count
     * 
     * Get total unread message count
     */
    async getUnreadCount(): Promise<UnreadCountResponse> {
        const path = '/chat/unread';
        return await this.client.call('get', path);
    }

    /**
     * Search Messages
     * 
     * Search messages across conversations
     */
    async searchMessages(
        query: string,
        conversationId?: string
    ): Promise<MessageListResponse> {
        const path = '/chat/search';
        const payload: any = { query };
        if (conversationId) payload.conversation_id = conversationId;
        
        return await this.client.call('get', path, {}, payload);
    }
}

// Types
export interface ConversationResponse {
    status_code: number;
    conversation: Conversation;
}

export interface Conversation {
    id: string;
    task_id: string;
    participants: number[];
    last_message?: Message;
    unread_count: number;
    created_at: string;
    updated_at: string;
}

export interface ConversationListResponse {
    status_code: number;
    conversations: Conversation[];
    total: number;
}

export interface MessageResponse {
    status_code: number;
    message: Message;
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: number;
    content: string;
    type: string;
    metadata?: any;
    is_read: boolean;
    created_at: string;
}

export interface MessageListResponse {
    status_code: number;
    messages: Message[];
    total: number;
}

export interface UnreadCountResponse {
    status_code: number;
    unread_count: number;
}

export interface StatusResponse {
    status_code: number;
    status_msg: string;
}
