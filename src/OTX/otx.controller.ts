import { Controller, Get, Param } from '@nestjs/common';
import { OtxService } from './otx.service';

@Controller('otx')
export class OtxController {
    constructor(private readonly otxService: OtxService) {}

    // Get Subscribed Pulses
    @Get('pulses')
    async getPulses() {
        return await this.otxService.getPulses();
    }

    // Get Indicators for a Pulse
    @Get('pulses/:pulseId/indicators')
    async getPulseIndicators(@Param('pulseId') pulseId: string) {
        return await this.otxService.getPulseIndicators(pulseId);
    }

    // Get IP Reputation
    @Get('ip/:ip')
    async getIpReputation(@Param('ip') ip: string) {
        return await this.otxService.getIpReputation(ip);
    }

    // Get Domain Reputation
    @Get('domain/:domain')
    async getDomainReputation(@Param('domain') domain: string) {
        return await this.otxService.getDomainReputation(domain);
    }

    // Get URL Reputation
    @Get('url/:url')
    async getUrlReputation(@Param('url') url: string) {
        return await this.otxService.getUrlReputation(url);
    }

    // Get File Hash Reputation (MD5, SHA1, or SHA256)
    @Get('file/:fileHash')
    async getFileHashReputation(@Param('fileHash') fileHash: string) {
        return await this.otxService.getFileHashReputation(fileHash);
    }
}
