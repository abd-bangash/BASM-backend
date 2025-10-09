import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CleartextCredentialsService } from './cleartext_credentials.service';
import { LazyModuleLoader } from "@nestjs/core";

@Controller('cleartext-credentials')
export class CleartextCredentialsController {
    constructor(
        private readonly cleartextService: CleartextCredentialsService,
        private lazyModuleLoader: LazyModuleLoader
    ) {}

    // Route to fetch cleartext credentials for a given domain
    @Get('credentials-by-domain')
    async getCleartextCredentialsByDomain(
        @Query('domain') domain: string,
        @Query('pageSize') pageSize?: string,
        @Query('pagingToken') pagingToken?: string,
        @Query('includeExposureDetails') includeExposureDetails?: string,
    ): Promise<any> {
        if (!domain) {
            throw new HttpException('Domain is required', HttpStatus.BAD_REQUEST);
        }

        return this.cleartextService.getCleartextCredentialsByDomain(
            domain,
            pageSize ? Number(pageSize) : undefined,
            pagingToken,
            includeExposureDetails ? Number(includeExposureDetails) : undefined,
        );
    }

    // Route to fetch cleartext credentials by email
    @Get('credentials-by-email')
    async getCleartextCredentialsByEmail(
        @Query('username') username: string,
        @Query('includeExposureDetails') includeExposureDetails?: string,
    ): Promise<any> {
        if (!username) {
            throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
        }

        try {
            return await this.cleartextService.getCleartextCredentialsByEmail(
                username,
                includeExposureDetails ? Number(includeExposureDetails) : undefined,
            );
        } catch (error) {
            throw new HttpException(
                `Error fetching cleartext credentials: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
