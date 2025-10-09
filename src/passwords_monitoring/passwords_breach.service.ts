import {Injectable} from "@nestjs/common";
import {HttpModule, HttpService} from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';  // For converting Observable to Promise
import { AxiosResponse } from 'axios';  // Optional, but useful to type the Axios response
// Import from @nestjs/axios
import {ConfigService} from "@nestjs/config";
import { createHash } from 'crypto';

@Injectable()
export class PasswordsBreachService {
    private readonly apiKey: string;
    private readonly apiSecret: string;
    constructor(private readonly httpService: HttpService, private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('ENZOIC_API_KEY');
        this.apiSecret = this.configService.get<string>('ENZOIC_API_SECRET');
    }

    private getAuthHeaders() {
        const token = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64');
        console.log(token);
        return {
            "Authorization": `Basic ${token}`,
            'Content-Type': 'application/json',
        };
    }
    async checkPassword(password: string): Promise<any> {
        const url = 'https://api.enzoic.com/v1/passwords';
        const sha256Hash = createHash('sha256').update(password).digest('hex');
        const headers = this.getAuthHeaders();

        const body = {
            'partialSHA256': sha256Hash.slice(0,10),
        };
        try {
            // Use AxiosResponse<any> to ensure response has a 'data' property
            const response: AxiosResponse<any> = await lastValueFrom(
                this.httpService.post(url, body, { headers })
            );

            // Now you can safely access response.data without type errors
            return {
                status: 201,
                your_hash: sha256Hash,
                data: response.data
            };  // Return the actual data from the API
        } catch (error) {
            if (error.response?.status === 404) {
                return {
                    status: 404,
                    data: 'No candidate found.'
                }
            }
            throw new Error('Failed to check password: ' + error.message);
        }
    }
}