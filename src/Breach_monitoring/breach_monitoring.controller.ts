// breach_monitoring.controller.ts
import {Controller, Get, HttpException, HttpStatus, Query, Body, Post, Delete} from '@nestjs/common';
import { Breach_monitoringService } from './breach_monitoring.service';

@Controller('enzoic')
export class Breach_monitoringController {
    constructor(private readonly enzoicService: Breach_monitoringService) {}



    @Get('breach-monitoring')
    async getBreachMonitoring(@Query('domain') domain: string) {
        if (!domain) {
            throw new HttpException('Domain is required', HttpStatus.BAD_REQUEST);
        }
        return this.enzoicService.addBreachMonitoringByDomain(domain);
    }

    @Get('webhook-test')
    async webhookTest(){
        return this.enzoicService.webhookTest();
    }

    @Post('add-domain-alert-subscriptions')
    async addDomainAlertSubscriptions(@Query('domains') domains: string[]) {
        console.log(domains);
        return this.enzoicService.addDomainAlertSubscriptions(domains);
    }

    @Delete('delete-domain-alert-subscriptions')
    async deleteDomainAlertSubscriptions(@Body() body: { domains: string[] }) {
        return this.enzoicService.deleteDomainAlertSubscriptions(body.domains);
    }

    @Get('check-domain-subscription')
    async checkDomainSubscription(@Query('domain') domain: string) {
        if (!domain) {
            throw new HttpException('Domain is required', HttpStatus.BAD_REQUEST);
        }
        return this.enzoicService.isDomainSubscribedForAlerts(domain);
    }

    @Get('domain-alert-subscriptions')
    async getDomainAlertSubscriptions(
        @Query('pageSize') pageSize: number,
        @Query('pagingToken') pagingToken: string,
    ) {
        return this.enzoicService.getDomainAlertSubscriptions(pageSize || 4, pagingToken);
    }
    @Post('register-webhook')
    async registerWebhook(@Body('url') url: string) {
        return this.enzoicService.registerWebhook(url);
    }
}

