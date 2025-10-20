import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OtxService {
    // Defining the OTX API base URL and API key
    private readonly otxApiUrl = 'https://otx.alienvault.com/api/v1/';
    private readonly apiKey = '83043970308c312dac270aba9a8d7b35906e38756128e398c1d6f42f690f14a3'; // Replace with your actual OTX API key

    constructor(private readonly httpService: HttpService) { }

    // Get Pulses from OTX
    async getPulses(): Promise<any> {
        try {
            const response = this.httpService.get(`${this.otxApiUrl}pulses/subscribed`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            });
            const result = await lastValueFrom(response);
            return result.data; // ✅ only the JSON-safe data
        } catch (error) {
            console.error('Error fetching OTX pulses:', error.message);
            throw new HttpException('Failed to fetch OTX pulses', error.response?.status || 500);
        }
    }


    // Get Indicators of Compromise (IoCs) for a Pulse
    async getPulseIndicators(pulseId: string): Promise<any> {
        try {
            const response = this.httpService.get(`${this.otxApiUrl}pulses/${pulseId}/indicators`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`, // Using your API key directly
                },
            });
            return await lastValueFrom(response);
        } catch (error) {
            console.error(`Error fetching indicators for pulse ${pulseId}:`, error.message);
            throw new HttpException('Failed to fetch pulse indicators', error.response?.status || 500);
        }
    }

    // Get IP Reputation
    async getIpReputation(ip: string): Promise<any> {
        try {
            const response = this.httpService.get(`${this.otxApiUrl}indicators/IPv4/${ip}/general`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`, // Using your API key directly
                },
            });
            return await lastValueFrom(response);
        } catch (error) {
            console.error(`Error fetching IP reputation for ${ip}:`, error.message);
            throw new HttpException('Failed to fetch IP reputation', error.response?.status || 500);
        }
    }

    // Get Domain Reputation
    async getDomainReputation(domain: string): Promise<any> {
        try {
            const response = this.httpService.get(`${this.otxApiUrl}indicators/domain/${domain}/general`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`, // Using your API key directly
                },
            });
            return await lastValueFrom(response);
        } catch (error) {
            console.error(`Error fetching domain reputation for ${domain}:`, error.message);
            throw new HttpException('Failed to fetch domain reputation', error.response?.status || 500);
        }
    }

    // Get URL Reputation
    async getUrlReputation(url: string): Promise<any> {
        try {
            const response = this.httpService.get(`${this.otxApiUrl}indicators/url/${encodeURIComponent(url)}/general`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`, // Using your API key directly
                },
            });
            return await lastValueFrom(response);
        } catch (error) {
            console.error(`Error fetching URL reputation for ${url}:`, error.message);
            throw new HttpException('Failed to fetch URL reputation', error.response?.status || 500);
        }
    }

    // Get File Hash Reputation (MD5, SHA1, or SHA256)
    async getFileHashReputation(fileHash: string): Promise<any> {
        try {
            const response = this.httpService.get(`${this.otxApiUrl}indicators/file/${fileHash}/general`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`, // Using your API key directly
                },
            });
            return await lastValueFrom(response);
        } catch (error) {
            console.error(`Error fetching file hash reputation for ${fileHash}:`, error.message);
            throw new HttpException('Failed to fetch file hash reputation', error.response?.status || 500);
        }
    }
}
