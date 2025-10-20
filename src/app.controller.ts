import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { Public } from "./common/decorators";
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService, private readonly appService: AppService) { }

  @Public()
  @Get()
  async getHello() {
    return this.appService.getHello();
  }

  // @UseGuards(LocalAuthGuard)
  // @UseGuards(LocalAuthGuard)
  // @Post('auth/login')
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.signIn(req.user);
  }
}
