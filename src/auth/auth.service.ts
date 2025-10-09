import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/SuperUser/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ClientsService } from 'src/clients/clients.service';
import mongoose, { Model, Types } from 'mongoose';
import { authenticator } from "otplib";
import * as QRCode from 'qrcode';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes } from 'crypto';
import { InjectModel } from "@nestjs/mongoose";
import { Auth2FA } from "../database/schemas/auth.schema";
import { jwtConstant } from "./constant";
import { Tokens } from "./types";
import { ClientDto } from "../database/dto/client.dto";
import { SuperUserDto } from "../database/dto/superuser.dto";
import { SuperUser } from "../database/schemas/super_user.schema";

interface Client {
  _id: Types.ObjectId;
  username: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private clientService: ClientsService,
    private mailerService: MailerService,
    private superuserService: UsersService,
    @InjectModel("authCollection") private authModel: Model<Auth2FA>,
  ) {

  }

  // This is to validate the user. We check if the provided email and password is correct or not.
  async validateUser(email: string, password: string): Promise<any> {
    // console.log('Inside validateUser {authService}')
    const user = await this.userService.findByEmail(email);
    const client = await this.clientService.findClientByEmail(email);
    // First check if user is an admin or no
    if (user && await bcrypt.compare(password, user?.password)) {
      const { password, ...result } = user;
      result['isAdmin'] = true;
      return result;
    }
    // Then check if user is a client or no
    if (client && await bcrypt.compare(password, client?.password)) {
      const { password, ...result } = client;
      result['isAdmin'] = false;
      return result;
    }
    return null;
  }

  async signIn(
    user: Client,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // // Just return the JWT token
    // console.log("The user is: ", user);
    const payload = { sub: user._id.toString(), email: user.email, username: user.username, isAdmin: user.isAdmin };
    const tokens = await this.getTokens(payload.sub, payload.isAdmin, payload.email, payload.username);
    await this.updateRtHash(user._id.toString(), tokens.refresh_token);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    }
  }

  async logout(userId: string) {
    const client = await this.clientService.findOne(userId);
    const superUser = await this.superuserService.findByUserId(userId);
    let response: boolean;
    if (client && client.hashedRT !== null) {
      response = await this.clientService.deleteClientRt(client.username) ? true : null;
    }
    if (superUser && superUser.hashedRT !== null) {
      response = await this.superuserService.deleteSuperUserRt(userId) ? true : null;
    }
    return response;
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    const responseClient = await this.clientService.updateClientRt(userId, hash);
    const responseSuperuser = await this.superuserService.updateSuperUserRt(userId, hash);
    if (responseClient === null && responseSuperuser === null) {
      // If both were null then user DNE
      return null;
    }
    return responseClient ? responseClient : responseSuperuser;
  }

  async createClient(newClient: ClientDto) {
    const createdClient = await this.clientService.createClient(newClient);
    const userId = createdClient['_id'].toString();
    const email = createdClient.email;
    const username = createdClient.username;
    // Once the client is created we can update their RT hash
    const tokens = await this.getTokens(userId, false, email, username);
    await this.updateRtHash(userId, tokens.refresh_token);
    return this.clientService.findClientByEmail(email);
  }

  async createSuperUser(superUserDTO: SuperUserDto) {
    const superUser = await this.superuserService.createSuperUser(
      superUserDTO.username,
      superUserDTO.name,
      superUserDTO.email,
      superUserDTO.password,
    );
    const userId = superUser['_id'].toString();
    const email = superUser.email;
    const username = superUser.username;
    const tokens = await this.getTokens(userId, false, email, username);
    await this.updateRtHash(userId, tokens.refresh_token);

    return this.superuserService.findByEmail(email);
  }

  async updateUserPassword(username: string, oldPassword: string, newPassword: string, confirmPassword: string): Promise<any> {
    console.log(`
      username: ${username},
      oldPassword: ${oldPassword},
      newPassword: ${newPassword},
      confirmPassword: ${confirmPassword}
    `)
    const clientUserPassword = await this.clientService.getClientPasswordByUsername(username);
    const superUserPassword = await this.superuserService.getSuperUserPasswordByUsername(username);
    if (!clientUserPassword && !superUserPassword) throw new NotFoundException();
    if (clientUserPassword) {
      console.log(oldPassword);
      console.log(clientUserPassword);
      const isHashSame = await bcrypt.compare(oldPassword, clientUserPassword);
      if (!isHashSame || newPassword !== confirmPassword) throw new UnauthorizedException();
      const newPasswordHash = await bcrypt.hash(newPassword, 12);
      const updateResponse = await this.clientService.updateClientByUsername(username, {
        password: newPasswordHash,
      });
      return !!(updateResponse.matchedCount && updateResponse.modifiedCount);
    } else {
      const isHashSame = await bcrypt.compare(oldPassword, superUserPassword);
      if (!isHashSame || newPassword !== confirmPassword) throw new UnauthorizedException();
      const newPasswordHash = await bcrypt.hash(newPassword, 12);
      const updateResponse = await this.superuserService.updateSuperUserByUsername(username, {
        password: newPasswordHash,
      });
      return !!(updateResponse.matchedCount && updateResponse.modifiedCount);
    }
  }

  async generate2faQRCode(username: string, service: string) {
    console.log(username, service);
    const user = await this.clientService.findClientByEmail(username);
    const user2faSecret = user.twoFactorAuthenticationSecret;
    const otpauth = authenticator.keyuri(username, service, user2faSecret)
    console.log(`Generated otpauth: ${otpauth}`);
    return await QRCode.toDataURL(otpauth, {
      scale: 10,
      margin: 2
    });
  }

  // Generate random 6-digit 2FA code
  generate2FACode(): string {
    return randomBytes(3).toString('hex').toUpperCase(); // example code format
  }

  async send2FAEmail(clientEmail: string): Promise<void> {
    const user = await this.clientService.findClientByEmail(clientEmail);
    const superUser = await this.userService.findByEmail(clientEmail);
    if (user || superUser) {
      const twoFACode = this.generate2FACode();
      let username = '';
      if (user) username = user.name;
      else username = superUser.name;

      // For development, skip email sending and just log the code
      console.log(`2FA Code for ${clientEmail}: ${twoFACode}`);

      // TODO: Uncomment this when email is properly configured
      // try {
      //   await this.mailerService.sendMail({
      //     to: clientEmail,
      //     subject: 'Your BASM Two-Factor Authentication Code',
      //     template: '2fa',
      //     context: {
      //       username: username,
      //       twoFactorCode: twoFACode,
      //       companyName: 'ThreatCure',
      //       year: 2024,
      //       imageURL: "https://i.ibb.co/5KBGPvD/tc.png"
      //     },
      //   });
      // } catch (error) {
      //   console.error('Email sending failed:', error);
      //   // Continue with the flow even if email fails
      // }

      // First check if a previous code already saved in the database
      const previousCode = await this.authModel.find({ email: clientEmail }).exec();
      if (previousCode.length > 0) {
        // If there is a code that already exists, delete them
        await this.authModel.deleteMany({ email: clientEmail });
      }

      // After sending the mail, save the code in the database for 10 minutes
      const data = new this.authModel({
        email: clientEmail,
        code: twoFACode
      });
      await data.save();
    }
  }

  /*
  This function checks if the 2FA code for a particular user matches.
   */
  async verifyTwoFactorAuthCode(email: string, code: string) {
    const userCode = await this.authModel.findOne({ email: email });
    if (!userCode) {
      return false;
    }
    return code === userCode.code;
  }

  async refreshTokens(userId: string, refresh_token: string) {
    const user = await this.clientService.findOne(userId);
    const superUser = await this.superuserService.findByUserId(userId);
    if (!user && !superUser) throw new ForbiddenException("Access Denied");
    // If it is a client
    if (user && user.hashedRT) {
      const rtUser = await bcrypt.compare(refresh_token, user.hashedRT);
      if (!rtUser) throw new ForbiddenException("Access Denied");
      return this.generateNewTokens(userId, user, false);
    } else if (superUser && superUser.hashedRT) {
      // If it is a super-user
      const rtSuperUser = await bcrypt.compare(refresh_token, superUser.hashedRT);
      if (!rtSuperUser) throw new ForbiddenException("Access Denied");
      return this.generateNewTokens(userId, SuperUser, true);
    } else {
      throw new ForbiddenException("Access Denied");
    }
  }

  private async generateNewTokens(userId: string, user: any, isAdmin: boolean) {
    if (isAdmin) {
      // If it is a super-user
      const tokensGenerated = await this.getTokens(userId, isAdmin, user.email, user.username);
      await this.updateRtHash(userId, tokensGenerated.refresh_token);
      return tokensGenerated;
    } else {
      // if it is a normal client
      const tokensGenerated = await this.getTokens(userId, isAdmin, user.email, user.username);
      await this.updateRtHash(userId, tokensGenerated.refresh_token);
      return tokensGenerated;
    }
  }

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 12);
  }

  async getTokens(userId: string, isAdmin: boolean, email: string, username: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          username,
          isAdmin
        },
        {
          secret: jwtConstant.secret
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          username,
          isAdmin
        },
        {
          secret: jwtConstant.rt_secret,
          expiresIn: 60 * 60 * 24 * 7 // expire in 7 days
        }
      )
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    }
  }
}