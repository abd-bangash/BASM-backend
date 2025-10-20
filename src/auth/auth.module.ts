import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/SuperUser/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ClientsModule } from 'src/clients/clients.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {Auth2FASchema} from "../database/schemas/auth.schema";
import {RtStrategy} from "./strategies/rt.strategy";


import { TrainingStrategy } from './strategies/training.strategy';

@Module({
  imports: [
      MongooseModule.forFeature([{name: 'authCollection', schema: Auth2FASchema}]),
      UsersModule,
      ClientsModule,
      JwtModule.register({
        signOptions: { expiresIn: '60m' },
      }),
      MailerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: {
            host: 'smtp.titan.email', // or your SMTP provider
            secure: true,
            secureConnection: false,
            tls:{
              cipher:"SSLv3",
            },
            requireTLS:true,
            port: 465,
            debug:true,
            connectionTimeout: 10000,
            auth: {
              user: configService.get<string>('NO_REPLY_EMAIL'),
              pass: configService.get<string>('NO_REPLY_EMAIL_PASSWD'),
            },
          },
          defaults: {
            from: '"ThreatCure BASM " <no-reply@threatcure.net>',
          },
          template: {
            dir: join(process.cwd(), 'src', 'auth', 'templates'),
            adapter: new HandlebarsAdapter(), // or Pug, EJS, etc.
            options: {
              strict: true,
            },
          },
        }),
      }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RtStrategy, TrainingStrategy],
  exports: [AuthService],
})
export class AuthModule {}