// Quickly and easily check if a given password is weak or known to be compromised

// Allows you to check whether a given password is known to be compromised, without
// needing to pass the exact password hash in. Rather than passing exact hashes of the
// password to the API, it is only necessary to supply the first 10 hex characters of
// each hash. A list of candidate hashes will then be returned and can be compared locally with the exact hash
// to determine if there was a match. This is the recommended approach for new implementations using
// the Passwords API.

import {Controller, Post, Body, Get} from '@nestjs/common';
import { PasswordsBreachService } from './passwords_breach.service';

// Import from @nestjs/axios


@Controller('password-breach')
export class PasswordsBreachController {
    constructor(private readonly passwordsService: PasswordsBreachService) {}
    @Get()
    async getHello() {
        return "Hello from password breach";
    }
    @Post('hash')
    async checkPassword(@Body('password') password: string): Promise<any> {
        console.log(password)
        return await this.passwordsService.checkPassword(password);
    }
}
