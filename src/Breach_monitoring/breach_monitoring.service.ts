// src/enzoic/breach_monitoring.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Breach_monitoringService {
    private readonly baseUrl = 'https://api.enzoic.com/v1/breach-monitoring-for-domains/';
    private readonly apiKey: string;
    private readonly apiSecret: string;

    constructor(private readonly configService: ConfigService) {
        this.apiKey = this.configService.get<string>('ENZOIC_API_KEY');
        this.apiSecret = this.configService.get<string>('ENZOIC_API_SECRET');
    }

    // Helper function to generate basic auth header
    private getAuthHeaders() {
        const token = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64');
        return {
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json',
        };
    }

    // Method to register a webhook
    async registerWebhook(url: string): Promise<any> {
        try {
            const response = await axios.post(
                'https://api.enzoic.com/v1/webhooks',
                { url },
                { headers: this.getAuthHeaders() },
            );
            return response.data; // Return the response data (including webhook ID)
        } catch (error) {
            throw new HttpException(
                `Error registering webhook: ${error.response?.data?.message || error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Method to get breach monitoring results for a specific domain
    async addBreachMonitoringByDomain(domain: string): Promise<any> {
        try {
            const response = await axios.post(
                `${this.baseUrl}`,
                { domain },
                { headers: this.getAuthHeaders() },
            );
            return response.data;
        } catch (error) {
            throw new HttpException(
                `Error fetching breach data for domain: ${error.response?.data?.message || error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Add domain alert subscriptions
    async addDomainAlertSubscriptions(domains: string[]): Promise<any> {
        try {
            const response = await axios.post(
                `${this.baseUrl}`,
                { domains },
                { headers: this.getAuthHeaders() },
            );
            return response.data;
        } catch (error) {
            throw new HttpException(
                `Error adding domain alert subscriptions: ${error.response?.data?.message || error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Delete domain alert subscriptions
    async deleteDomainAlertSubscriptions(domains: string[]): Promise<any> {
        try {
            const response = await axios.delete(
                `${this.baseUrl}breach-monitoring/domain-alert-subscriptions`,
                {
                    headers: this.getAuthHeaders(),
                    data: { domains },
                },
            );
            return response.data;
        } catch (error) {
            throw new HttpException(
                `Error deleting domain alert subscriptions: ${error.response?.data?.message || error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async webhookTest() {
        try {
            const response = await axios.get('https://api.enzoic.com/v1/webhook-test', {
                headers: this.getAuthHeaders(),
                params: {
                    type: 'breachAlert'
                }
            });
            return response.data;
        } catch (error) {
            throw new HttpException(
                `Error testing webhook: ${error.response?.data?.message || error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    // Check if a domain is already subscribed
    async isDomainSubscribedForAlerts(domain: string): Promise<boolean> {
        try {
            const response = await axios.get(
                `${this.baseUrl}breach-monitoring/domain-alert-subscriptions/${domain}`,
                { headers: this.getAuthHeaders() },
            );
            return response.data.subscribed;
        } catch (error) {
            throw new HttpException(
                `Error checking domain subscription: ${error.response?.data?.message || error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Get all domain alert subscriptions (supports pagination)
    async getDomainAlertSubscriptions(pageSize = 4, pagingToken = null): Promise<any> {
        try {
            const response = await axios.get(
                `${this.baseUrl}breach-monitoring/domain-alert-subscriptions`,
                {
                    headers: this.getAuthHeaders(),
                    params: { pageSize, pagingToken },
                },
            );
            return response.data;
        } catch (error) {
            throw new HttpException(
                `Error fetching domain alert subscriptions: ${error.response?.data?.message || error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
