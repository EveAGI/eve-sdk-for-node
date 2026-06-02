import { Client } from '../client';

/**
 * Eve.AI Provider Discovery Service
 * 
 * AI-powered provider search and automated outreach
 */
export class EveAIProviderDiscovery {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Search Providers for Task
     * 
     * Search web for local providers matching task requirements
     */
    async searchProvidersForTask(
        taskId: string,
        category: string,
        location: string,
        radiusMiles: number = 25,
        maxResults: number = 20
    ): Promise<SearchProvidersResponse> {
        const path = '/provider-discovery/search';
        const uri = new URL(this.client.config.endpoint + path);
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, {
            task_id: taskId,
            category,
            location,
            radius_miles: radiusMiles,
            max_results: maxResults
        });
    }

    /**
     * Contact Providers
     * 
     * Send automated outreach to discovered providers
     */
    async contactProviders(
        searchId: string,
        taskId: string,
        taskInfo: TaskOutreachInfo,
        maxProviders: number = 10
    ): Promise<ContactProvidersResponse> {
        const path = '/provider-discovery/contact';
        const uri = new URL(this.client.config.endpoint + path);
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, {
            search_id: searchId,
            task_id: taskId,
            task_title: taskInfo.title,
            task_description: taskInfo.description,
            task_category: taskInfo.category,
            task_location: taskInfo.location,
            estimated_price: taskInfo.estimatedPrice,
            urgency: taskInfo.urgency,
            max_providers: maxProviders
        });
    }

    /**
     * Get Search Results
     * 
     * Get results of a provider search
     */
    async getSearchResults(searchId: string): Promise<SearchResultsResponse> {
        const path = `/provider-discovery/search/${searchId}`;
        const uri = new URL(this.client.config.endpoint + path);
        return await this.client.call('get', uri);
    }

    /**
     * Track Provider Response
     * 
     * Track when a provider responds to outreach
     */
    async trackProviderResponse(
        attemptId: string,
        providerId: string,
        taskId: string,
        responseType: string,
        message?: string
    ): Promise<StatusResponse> {
        const path = '/provider-discovery/track';
        const uri = new URL(this.client.config.endpoint + path);
        return await this.client.call('post', uri, {
            'content-type': 'application/json',
        }, {
            attempt_id: attemptId,
            provider_id: providerId,
            task_id: taskId,
            response_type: responseType,
            message
        });
    }

    /**
     * Get Conversion Stats
     * 
     * Get provider conversion funnel statistics
     */
    async getConversionStats(
        searchId?: string,
        startDate?: string,
        endDate?: string
    ): Promise<ConversionStatsResponse> {
        const path = '/provider-discovery/stats';
        const payload: any = {};
        if (searchId) payload.search_id = searchId;
        if (startDate) payload.start_date = startDate;
        if (endDate) payload.end_date = endDate;

        const uri = new URL(this.client.config.endpoint + path);
        return await this.client.call('get', uri, {}, payload);
    }
}

// Types
export interface TaskOutreachInfo {
    title: string;
    description: string;
    category: string;
    location: string;
    estimatedPrice: number;
    urgency: string;
}

export interface SearchProvidersResponse {
    status_code: number;
    status_msg: string;
    search_id: string;
    providers: DiscoveredProvider[];
}

export interface DiscoveredProvider {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    website?: string;
    address: string;
    rating?: number;
    review_count: number;
    distance?: number;
    source: string;
}

export interface ContactProvidersResponse {
    status_code: number;
    status_msg: string;
    providers_contacted: number;
    attempts: OutreachAttempt[];
}

export interface OutreachAttempt {
    id: string;
    provider_id: string;
    method: string;
    status: string;
}

export interface SearchResultsResponse {
    status_code: number;
    status_msg: string;
    search: SearchResult;
}

export interface SearchResult {
    id: string;
    task_id: string;
    category: string;
    location: string;
    providers_found: number;
    providers_contacted: number;
    providers_responded: number;
    status: string;
    created_at: string;
}

export interface StatusResponse {
    status_code: number;
    status_msg: string;
}

export interface ConversionStatsResponse {
    status_code: number;
    stats: {
        total_searches: number;
        total_providers_found: number;
        total_contacted: number;
        total_clicked: number;
        total_downloaded: number;
        total_registered: number;
        total_active: number;
        conversion_rate: number;
    };
}
