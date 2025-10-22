import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { Exposure } from "../models/domain-exposures.model";


@Injectable()
export class ExposureService {
    //private readonly baseUrl = 'https://api.enzoic.com/v1/exposures-for-domain';
    private readonly apiKey: string;
    private readonly apiSecret: string;
    // Define all routes as individual local variables
    private readonly emailExposureUrl = 'https://api.enzoic.com/v1/exposures-for-usernames';
    private readonly passwordExposureUrl = 'https://api.enzoic.com/v1/exposures/password';
    private readonly domainExposureUrl = 'https://api.enzoic.com/v1/exposures-for-domain';
    private readonly exposureDetailsUrl = 'https://api.enzoic.com/v1/exposure-details';

    constructor(private readonly configService: ConfigService) {
        this.apiKey = this.configService.get<string>('ENZOIC_API_KEY');
        this.apiSecret = this.configService.get<string>('ENZOIC_API_SECRET');
        if (!this.apiKey || !this.apiSecret) {
            throw new HttpException("Dark Web Exposures API key or secret is undefined.", 500);
        }

    }

    private getAuthHeaders() {
        const token = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64');
        return {
            "Authorization": `Basic ${token}`,
            'Content-Type': 'application/json',
        };
    }

    // Method to search exposures by email
    async getExposuresByEmail(usernames: string, includeExposureDetails?: number): Promise<any> {
        console.log(this.getAuthHeaders())
        try {
            const response = await axios.get(
                `${this.emailExposureUrl}`,
                {
                    headers: this.getAuthHeaders(),
                    params: {
                        usernames,
                        includeExposureDetails
                    }
                },
            );
            return response.data;
        } catch (error) {
            throw new HttpException(
                `Error fetching exposures for email: ${error.response?.data?.message || error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Method to check if a password has been exposed
    async checkPasswordExposure(password: string): Promise<any> {
        try {
            const response = await axios.post(
                `${this.passwordExposureUrl}exposures/password`,
                { password },
                { headers: this.getAuthHeaders() },
            );
            return response.data;
        } catch (error) {
            throw new HttpException(
                `Error checking password exposure: ${error.response?.data?.message || error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    // Method to get exposures by domain
    async getExposuresByDomain(
        domain: string,
        includeExposureDetails?: number,
        pageSize?: number,
        pagingToken?: string
    ): Promise<Exposure> {
        try {
            console.log(this.getAuthHeaders())
            const response = await axios.get(
                `${this.domainExposureUrl}`, // Adjust the URL based on Enzoic's API documentation
                {
                    headers: this.getAuthHeaders(),
                    params: {
                        domain, // Required domain parameter
                        includeExposureDetails, // Optional, include details if specified and non-zero
                        pageSize, // Optional page size
                        pagingToken, // Optional paging token for pagination },
                    },
                }
            );
            return response.data; // Return the API response
        } catch (error) {
            throw new HttpException(
                `Error fetching exposures for domain: ${error.response?.data?.message || error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    //baseurl = "https://api.enzoic.com/v1/exposure-details"
    // Method to get exposure details by exposure ID
    async getExposureDetails(exposureId: string): Promise<any> {
        try {
            const response = await axios.get(
                `${this.exposureDetailsUrl}`, // Using only the base URL here
                {
                    headers: this.getAuthHeaders(), // Auth headers are included
                    params: {
                        id: encodeURIComponent(exposureId), // Passing the exposureId as a query parameter
                    },
                }
            );
            return response.data; // Returning the data from the response
        } catch (error) {
            throw new HttpException(
                `Error fetching exposure details: ${error.response?.data?.message || error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Below function returns exposure data for charts
    async getExposureForChart(domain: string, pageSize?: number) {
        const domainExposures = await this.getExposuresByDomain(domain, 1, pageSize);
        let exposureCategory: string[] = []; // These will be the chart labels
        let passwordTypes: string[] = [];
        let exposureDates: string[] = [];
        // This will have the number of exposure per category
        let exposureCount: {
            [category: string]: { count: number }
        } = {};
        let passwordTypeCount: {
            [passwordType: string]: { count: number }
        } = {};
        let exposureByYear: {
            [exposureByYear: string]: { count: number }
        } = {};

        for (let exposure of domainExposures.exposures) {
            const category = exposure.category;
            const passwordType = exposure.passwordType;
            const exposureYear = new Date(exposure.dateAdded).getFullYear().toString();

            if (!exposureCategory.includes(category)) {
                exposureCategory.push(category);
                exposureCount[category] = { count: 0 };
            }
            if (!passwordTypes.includes(passwordType)) {
                passwordTypes.push(passwordType);
                passwordTypeCount[passwordType] = { count: 0 };
            }
            if (!exposureDates.includes(exposureYear)) {
                exposureDates.push(exposureYear);
                exposureByYear[exposureYear] = { count: 0 };
            }

            passwordTypeCount[passwordType].count++;
            exposureCount[category].count++;
            exposureByYear[exposureYear].count++;
        }

        return {
            'exposure_categories': exposureCategory,
            'exposure_count': exposureCount,
            'password_types': passwordTypes,
            'password_types_count': passwordTypeCount,
            'exposure_years': exposureDates,
            'exposure_year_count': exposureByYear
        }
    }

}
