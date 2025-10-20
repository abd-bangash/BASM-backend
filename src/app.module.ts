import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppService } from './app.service';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from './clients/clients.module';
import { ClientsController } from './clients/clients.controller';
import { TabletopController } from './Tabletop/tabletop.controller';
import { TabletopModule } from './Tabletop/tabletop.module';
import { DefaultQuestionsModule } from './DefaultQuestions/dQuestions.module';
import { TimerController } from './timer/TimerController';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './SuperUser/users.module';
import { UsersController } from './SuperUser/users.controller';
import { ClientUsersModule } from './users/users.module';
import { QRCodeController } from './Tabletop/qr.controller';
import { QRCodeModule } from './Tabletop/qr.module';
import { TimerModule } from "./timer/Time.module";
import { Breach_monitoringController } from "./Breach_monitoring/breach_monitoring.controller";
import { Breach_monitoringModule } from "./Breach_monitoring/breach_monitoring.module";
import { ExposuresController } from "./exposure/exposure.controller";
import { ExposuresModule } from "./exposure/exposure.module";
import { OtxController } from "./OTX/otx.controller";
import { OtxModule } from "./OTX/otx.module";
import { CacheModule } from "@nestjs/cache-manager";
import { ResultsModule } from "./TabletopResults/results.module";
import { TabletopSessionsController } from './tabletop-sessions/tabletop-sessions.controller';
import { TabletopSessionsModule } from './tabletop-sessions/tabletop-sessions.module';
import { PasswordsBreachController } from "./passwords_monitoring/passwords_breach.controller";
import { PasswordsModule } from "./passwords_monitoring/passwords_breach.module";
import { CleartextCredentialsController } from "./Credentials/cleartext_credentials.controller";
import { CleartextModule } from "./Credentials/cleartext_credentials.module";
import { ResultsController } from "./TabletopResults/results.controller";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/guards";
import { TabletopGatewayModule } from "./gateway/gateway.module";
import { FeedbackModule } from './feedback/feedback.module';
import { tt_attendance_Module } from './Tabletop/tt_attendance.module';
import { DashboardlogicsModule } from './dashboardlogics/dashboardlogics.module';
import { VideoSessionModule } from './video-session/video-session.module';
import { EmailService } from './services/email.service';


import { TrainingModule } from './training/training.module';

@Module({
  controllers: [
    AppController,
    TimerController,
    ClientsController,
    TabletopController,
    UsersController,
    QRCodeController,
    ExposuresController,
    OtxController,
    ResultsController,
    TabletopSessionsController,
    PasswordsBreachController,
    CleartextCredentialsController,
  ],

  imports: [
    ScheduleModule.forRoot(), //for timer, we will need job scheduler
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/videos/categories'),
      serveRoot: '/videos', // will expose them at http://localhost:3000/videos/<filename>
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule, CacheModule.register({
        isGlobal: true,
      })],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URL'),
      }),
    }),
    ClientsModule,
    TabletopModule,
    DefaultQuestionsModule,
    AuthModule,
    UsersModule,
    QRCodeModule,
    TimerModule,
    Breach_monitoringModule,
    ExposuresModule,
    OtxModule,
    ResultsModule,
    TabletopSessionsModule,
    PasswordsModule,
    CleartextModule,
    ResultsModule,
    TabletopGatewayModule,
    FeedbackModule,
    tt_attendance_Module,
    ClientUsersModule,
    DashboardlogicsModule,
    VideoSessionModule,
    TrainingModule
  ],
  providers: [
    AppService,
    EmailService
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard // This enables the Jwt guard globally
    // }
  ],
})
export class AppModule { }
