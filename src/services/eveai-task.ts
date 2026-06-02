import { Client } from '../client';
import type { Models } from '../models';

/**
 * Eve.AI Task Service
 * 
 * Comprehensive task management and AI analysis for the Eve.AI marketplace
 */
export class EveAITask {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Create Task
     * 
     * Create a new task with AI analysis
     */
    async createTask(
        title: string,
        description: string,
        category: string,
        location: TaskLocation,
        urgency: string = 'medium',
        estimatedPrice?: number,
        imagePaths?: string[],
        audioPath?: string
    ): Promise<TaskResponse> {
        const path = '/task/create';
        const payload: any = {
            title,
            description,
            category,
            location,
            urgency,
            estimated_price: estimatedPrice,
            image_paths: imagePaths,
            audio_path: audioPath
        };

        return await this.client.call('post', path, {
            'content-type': 'application/json',
        }, payload);
    }

    /**
     * Get Task
     * 
     * Get task details by ID
     */
    async getTask(taskId: string): Promise<TaskResponse> {
        const path = `/task/${taskId}`;
        return await this.client.call('get', path);
    }

    /**
     * List Tasks
     * 
     * List tasks with filters
     */
    async listTasks(
        status?: string,
        category?: string,
        page: number = 1,
        pageSize: number = 20
    ): Promise<TaskListResponse> {
        const path = '/task/list';
        const payload: any = { page, page_size: pageSize };
        if (status) payload.status = status;
        if (category) payload.category = category;

        return await this.client.call('get', path, {}, payload);
    }

    /**
     * Accept Task
     * 
     * Provider accepts a task
     */
    async acceptTask(taskId: string): Promise<TaskResponse> {
        const path = `/task/${taskId}/accept`;
        return await this.client.call('post', path);
    }

    /**
     * Complete Task
     * 
     * Mark task as completed
     */
    async completeTask(taskId: string): Promise<TaskResponse> {
        const path = `/task/${taskId}/complete`;
        return await this.client.call('post', path);
    }

    /**
     * Cancel Task
     * 
     * Cancel a task
     */
    async cancelTask(taskId: string, reason?: string): Promise<TaskResponse> {
        const path = `/task/${taskId}/cancel`;
        return await this.client.call('post', path, {
            'content-type': 'application/json',
        }, { reason });
    }

    /**
     * Get Nearby Tasks
     * 
     * Get tasks near a location
     */
    async getNearbyTasks(
        latitude: number,
        longitude: number,
        radiusMiles: number = 25,
        category?: string
    ): Promise<TaskListResponse> {
        const path = '/task/nearby';
        const payload: any = {
            latitude,
            longitude,
            radius_miles: radiusMiles
        };
        if (category) payload.category = category;

        return await this.client.call('get', path, {}, payload);
    }

    /**
     * Analyze Text
     * 
     * AI analysis of text description
     */
    async analyzeText(text: string): Promise<AIAnalysisResponse> {
        const path = '/task/ai/analyze-text';
        return await this.client.call('post', path, {
            'content-type': 'application/json',
        }, { text });
    }

    /**
     * Analyze Voice
     * 
     * AI analysis of voice recording (Whisper + GPT-4)
     */
    async analyzeVoice(audioData: Buffer, audioFormat: string = 'mp3'): Promise<AIAnalysisResponse> {
        const path = '/task/ai/analyze-voice';
        const formData = new FormData();
        formData.append('audio', audioData, { filename: `audio.${audioFormat}` });
        
        return await this.client.call('post', path, {}, formData);
    }

    /**
     * Analyze Image
     * 
     * AI analysis of images (GPT-4 Vision)
     */
    async analyzeImage(imageData: Buffer, imageFormat: string = 'jpg'): Promise<AIAnalysisResponse> {
        const path = '/task/ai/analyze-image';
        const formData = new FormData();
        formData.append('image', imageData, { filename: `image.${imageFormat}` });
        
        return await this.client.call('post', path, {}, formData);
    }
}

// Types
export interface TaskLocation {
    latitude: number;
    longitude: number;
    address: string;
}

export interface TaskResponse {
    status_code: number;
    status_msg?: string;
    task?: Task;
}

export interface TaskListResponse {
    status_code: number;
    tasks: Task[];
    total: number;
}

export interface AIAnalysisResponse {
    status_code: number;
    analysis: AIAnalysis;
}

export interface Task {
    id: string;
    user_id: number;
    provider_id?: number;
    title: string;
    description: string;
    category: string;
    urgency: string;
    status: string;
    estimated_price: number;
    final_price?: number;
    tip?: number;
    location: TaskLocation;
    image_urls?: string[];
    audio_url?: string;
    created_at: string;
    updated_at: string;
}

export interface AIAnalysis {
    transcription?: string;
    detected_objects?: string[];
    scene_description?: string;
    suggested_category?: string;
    estimated_price?: number;
    suggestions?: TaskSuggestion[];
}

export interface TaskSuggestion {
    title: string;
    description: string;
    category: string;
    estimated_price: number;
    urgency: string;
}
