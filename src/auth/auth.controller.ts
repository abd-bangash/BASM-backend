import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus, Param, Patch,
  Post, Req,
  Request,
  Res,
  UseGuards
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LocalAuthGuard} from './local-auth.guard';
import {JwtAuthGuard, RefreshTokenGuard} from "./guards";
import {Response} from "express";
import axios from "axios";
import {Client} from "../database/schemas/client.schema";
import {ClientDto} from "../database/dto/client.dto";
import {SuperUserDto} from "../database/dto/superuser.dto";
import {SuperUser} from "../database/schemas/super_user.schema";
import {GetCurrentUser, GetCurrentUserId, Public} from "../common/decorators";
import {Cookies} from "../common/decorators/cookie.decorator";

@Controller('auth')
export class AuthController {
  ENVIRONMENT: string;
  constructor(private readonly authService: AuthService) {
    this.ENVIRONMENT = process.env.NODE_ENV;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Request() req){
    try {
      await this.authService.send2FAEmail(req.user.email);
      return { 
        message: '2FA code sent successfully',
        user: {
          email: req.user.email,
          username: req.user.username,
          isAdmin: req.user.isAdmin
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      // For development, return success even if email fails
      return { 
        message: 'Login successful (email sending disabled for development)',
        user: {
          email: req.user.email,
          username: req.user.username,
          isAdmin: req.user.isAdmin
        }
      };
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string) {
    console.log(userId);
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(@GetCurrentUserId() userId: string, @Cookies('refresh_token') refreshToken: string, @Res() res: Response) {
    const response = await this.authService.refreshTokens(userId, refreshToken);
    res.cookie('refresh_token', response.refresh_token, {
      httpOnly: true,
      sameSite: false,
      secure: this.ENVIRONMENT === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });
    const {refresh_token, ...access_token} = response;
    res.status(HttpStatus.OK).send(access_token);
  }

  //POST /clients
  @Post('create-client')
  async createClient(@Body() newClient: ClientDto): Promise<Client> {
    return this.authService.createClient(newClient);
  }

  @Post('create-superuser')
  async createSuperUser(@Body() superUserDTO: SuperUserDto): Promise<SuperUser>{
    return await this.authService.createSuperUser(superUserDTO);
  }

  @Get('verify')
  async verify(){
    return {
      message: 'OK',
      status_code: 200
    }
  }

  @Public()
  @Get('test')
  async test(){
    return {
      message: 'Auth service is working',
      timestamp: new Date().toISOString()
    }
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('2fa-email')
  async verifyTwoFactorAuth(@Body() twoFAData: {email: string, code: string}, @Res() res: Response, @Request() req){
    console.log("Got request: ", twoFAData);
    const response = await this.authService.verifyTwoFactorAuthCode(twoFAData.email, twoFAData.code);
    if (response) {
      const user = await this.authService.signIn(req.user);
      console.log(`Secure cookies: ${this.ENVIRONMENT === 'production'}`)
      res.cookie('refresh_token', user.refresh_token, {
        httpOnly: true,
        secure: this.ENVIRONMENT === 'production',
        sameSite: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
      });
      res.status(HttpStatus.OK).send(user);
    } else {
      res.status(HttpStatus.UNAUTHORIZED).send({message: 'OK'});
      return;
    }
  }

  @Public()
  @Patch('update-password')
  async updatePassword(@Body() data: {username: string; oldPassword: string; newPassword: string; confirmPassword: string}, @Res() res) {
    const response = this.authService.updateUserPassword(data.username, data.oldPassword, data.newPassword, data.confirmPassword);
    if (response) {
      res.status(HttpStatus.OK).send({message: 'UPDATED'});
    } else {
      res.status(HttpStatus.ACCEPTED).send({message: 'UPDATE UNSUCCESSFULLY'});
    }
  }

  @Public()
  @Post('2fa')
  async mfaLogin(@Body() req: {username: string, service: string}) {
    console.log(`Request: ${req.username}`);
    return this.authService.generate2faQRCode(req.username, req.service);
  }

  @Public()
  @Post('verify/recaptcha')
  async googleRecaptchaVerify(@Body() req: {response: string}) {
    const GOOGLE_API_URL = "https://www.google.com/recaptcha/api/siteverify";
    const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

    try {
      // Add timeout and retry configuration
      const response = await axios.post(
          GOOGLE_API_URL,
          null,
          {
            params: {
              secret: RECAPTCHA_SECRET,
              response: req.response,
            },
            timeout: 5000, 
            headers: {
              'User-Agent': 'Node.js reCAPTCHA Verification'
            }
          }
      );

      console.log("Recaptcha result: ", response.data);

      if (response.data.success) {
        return { success: true, ...response.data };
      } else {
        return {
          success: false,
          error: response.data['error-codes'] || 'Verification failed'
        };
      }
    } catch (error) {
      console.log("Recaptcha Error Details:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        config: {
          url: error.config?.url,
          timeout: error.config?.timeout,
          proxy: error.config?.proxy
        }
      });

      // More specific error handling
      if (error.code === 'ETIMEDOUT') {
        throw new HttpException('Verification service timeout - please try again', HttpStatus.GATEWAY_TIMEOUT);
      } else if (error.code === 'ECONNREFUSED') {
        throw new HttpException('Unable to reach verification service', HttpStatus.BAD_GATEWAY);
      }

      throw new HttpException('Verification service error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}

