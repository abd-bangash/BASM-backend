import {Controller, Get, Post, Query, Body, Param, HttpException, HttpStatus} from '@nestjs/common';
import { ExposureService } from './exposure.service';

@Controller('threatcure-exposures')
export class ExposuresController {
    constructor(private readonly exposureService: ExposureService) {}

    // Exposures API: Search exposures by email
    @Get('by-email-exposures')
    async getExposuresByEmail(@Query('usernames') usernames: string, @Query('includeExposureDetails') includeExposureDetails:number) {
        if (!usernames) {
            throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
        }
        return this.exposureService.getExposuresByEmail(usernames, includeExposureDetails);
    }

    // Exposures API: Check if a password has been exposed
    @Post('check-password-exposure')
    async checkPasswordExposure(@Body() body: { password: string }) {
        if (!body.password) {
            throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
        }
        return this.exposureService.checkPasswordExposure(body.password);
    }
    // Exposures API: Get exposures by domain
    // @Get('exposures/domain')
    // async getExposuresByDomain(@Query('domain') domain: string) {
    //     if (!domain) {
    //         throw new HttpException('Domain is required', HttpStatus.BAD_REQUEST);
    //     }
    //     return this.exposureService.getExposuresByDomain(domain); // Call the service method
    // }

    // Exposures API: Get exposures by domain with optional parameters
    @Get('exposures/domain')
    async getExposuresByDomain(
        @Query('domain') domain: string,
        @Query('includeExposureDetails') includeExposureDetails?: number,
        @Query('pageSize') pageSize?: number,
        @Query('pagingToken') pagingToken?: string
    ) {
        console.log("Got request from server", domain);
        if (!domain) {
            throw new HttpException('Domain is required', HttpStatus.BAD_REQUEST);
        }

        // Call the service with the optional parameters
        return this.exposureService.getExposuresByDomain(
            domain,
            includeExposureDetails,
            pageSize,
            pagingToken
        );
    }
    // Exposures API: Get exposure details by exposure ID

    @Get('exposures/details')
    async getExposureDetails(@Query('exposureId') exposureId: string) {
        if (!exposureId) {
            throw new HttpException('Exposure ID is required', HttpStatus.BAD_REQUEST);
        }
        return this.exposureService.getExposureDetails(exposureId); // Call the service method
    }

    @Get("exposures-for-chart/:domain/:pageSize")
    async getExposureForChart(@Param('domain') domain: string, @Param('pageSize') pageSize: number) {
       return await this.exposureService.getExposureForChart(domain, pageSize);
    }

}
