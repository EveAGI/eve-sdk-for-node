import { Client } from '../client';

/**
 * Eve.AI Payment Service
 * 
 * Stripe payment processing, subscriptions, and transaction management
 */
export class EveAIPayment {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Calculate Price
     * 
     * Calculate final price with platform fee and member discount
     */
    async calculatePrice(
        baseAmount: number,
        tip: number = 0,
        isMember: boolean = false
    ): Promise<PriceCalculationResponse> {
        const path = '/payment/calculate';
        return await this.client.call('post', path, {
            'content-type': 'application/json',
        }, {
            base_amount: baseAmount,
            tip,
            is_member: isMember
        });
    }

    /**
     * Create Payment Intent
     * 
     * Create Stripe payment intent for task payment
     */
    async createPaymentIntent(
        taskId: string,
        amount: number,
        currency: string = 'usd'
    ): Promise<PaymentIntentResponse> {
        const path = '/payment/create-intent';
        return await this.client.call('post', path, {
            'content-type': 'application/json',
        }, {
            task_id: taskId,
            amount,
            currency
        });
    }

    /**
     * Confirm Payment
     * 
     * Confirm payment and transfer funds
     */
    async confirmPayment(
        paymentIntentId: string,
        taskId: string
    ): Promise<PaymentResponse> {
        const path = '/payment/confirm';
        return await this.client.call('post', path, {
            'content-type': 'application/json',
        }, {
            payment_intent_id: paymentIntentId,
            task_id: taskId
        });
    }

    /**
     * Subscribe to Membership
     * 
     * Subscribe user to $25/month membership
     */
    async subscribe(paymentMethodId: string): Promise<SubscriptionResponse> {
        const path = '/payment/subscribe';
        return await this.client.call('post', path, {
            'content-type': 'application/json',
        }, {
            payment_method_id: paymentMethodId
        });
    }

    /**
     * Cancel Subscription
     * 
     * Cancel membership subscription
     */
    async cancelSubscription(): Promise<SubscriptionResponse> {
        const path = '/payment/cancel-subscription';
        return await this.client.call('post', path);
    }

    /**
     * Get Subscription Status
     * 
     * Check current subscription status
     */
    async getSubscription(): Promise<SubscriptionResponse> {
        const path = '/payment/subscription';
        return await this.client.call('get', path);
    }

    /**
     * Get Payment History
     * 
     * List all payments for user
     */
    async getPaymentHistory(
        page: number = 1,
        pageSize: number = 20
    ): Promise<PaymentListResponse> {
        const path = '/payment/history';
        return await this.client.call('get', path, {}, {
            page,
            page_size: pageSize
        });
    }

    /**
     * Get Earnings
     * 
     * Get provider earnings summary
     */
    async getEarnings(
        startDate?: string,
        endDate?: string
    ): Promise<EarningsResponse> {
        const path = '/payment/earnings';
        const payload: any = {};
        if (startDate) payload.start_date = startDate;
        if (endDate) payload.end_date = endDate;
        
        return await this.client.call('get', path, {}, payload);
    }

    /**
     * Request Payout
     * 
     * Request payout to bank account
     */
    async requestPayout(amount: number): Promise<PayoutResponse> {
        const path = '/payment/payout';
        return await this.client.call('post', path, {
            'content-type': 'application/json',
        }, { amount });
    }
}

// Types
export interface PriceCalculationResponse {
    status_code: number;
    total: number;
    base_amount: number;
    tip: number;
    platform_fee: number;
    discount: number;
    breakdown: {
        subtotal: number;
        platform_fee: number;
        discount: number;
        tip: number;
        total: number;
    };
}

export interface PaymentIntentResponse {
    status_code: number;
    client_secret: string;
    payment_intent_id: string;
}

export interface PaymentResponse {
    status_code: number;
    status_msg: string;
    payment: Payment;
}

export interface Payment {
    id: string;
    task_id: string;
    amount: number;
    status: string;
    created_at: string;
}

export interface SubscriptionResponse {
    status_code: number;
    subscription?: Subscription;
}

export interface Subscription {
    id: string;
    status: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
}

export interface PaymentListResponse {
    status_code: number;
    payments: Payment[];
    total: number;
}

export interface EarningsResponse {
    status_code: number;
    total_earnings: number;
    available_balance: number;
    pending_balance: number;
    breakdown: {
        completed_tasks: number;
        total_revenue: number;
        platform_fees: number;
        net_earnings: number;
    };
}

export interface PayoutResponse {
    status_code: number;
    payout_id: string;
    amount: number;
    status: string;
    estimated_arrival: string;
}
