import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CleartextCredentialsService {
    private readonly apiKey: string;
    private readonly apiSecret: string;
    private readonly CleartextCredentialsByDomainUrl = "https://api.enzoic.com/v1/cleartext-credentials-by-domain";
    private readonly CleartextCredentialsByEmailUrl = "https://api.enzoic.com/v1/cleartext-credentials";

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.apiKey = this.configService.get<string>('ENZOIC_API_KEY');
        this.apiSecret = this.configService.get<string>('ENZOIC_API_SECRET');
    }

    // Helper function to get Authorization headers
    private getAuthHeaders() {
        const token = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64');
        return {
            "Authorization": `Basic ${token}`,
            'Content-Type': 'application/json',
        };
    }

    // Function to fetch cleartext credentials by domain
    async getCleartextCredentialsByDomain(
        domain: string,
        pageSize?: number,
        pagingToken?: string,
        includeExposureDetails?: number,
    ): Promise<any> {
        try {
            console.log("Fetching domain credentials:", { domain, pageSize, pagingToken, includeExposureDetails });

            const response = await axios.get(
                `${this.CleartextCredentialsByDomainUrl}`,
                {
                    headers: this.getAuthHeaders(),
                    params: {
                        domain,
                        pageSize,
                        pagingToken,
                        includeExposureDetails,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Enzoic API Error (Domain):", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });

            throw new HttpException(
                `Error fetching exposures for domain: ${error.response?.data?.message || error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Function to fetch cleartext credentials by email
    async getCleartextCredentialsByEmail(
        username: string,
        includeExposureDetails?: number
    ): Promise<any> {
        try {
            console.log("Fetching email credentials:", { username, includeExposureDetails });

            const response = await axios.get(
                `${this.CleartextCredentialsByEmailUrl}`,
                {
                    headers: this.getAuthHeaders(),
                    params: {
                        username,
                        includeExposureDetails,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Enzoic API Error (Email):", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });

            throw new HttpException(
                `Error fetching exposures for the username/email provided: ${error.response?.data?.message || error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
