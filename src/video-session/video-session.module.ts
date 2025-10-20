// video-session.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TrainingSession, TrainingSessionSchema } from '../database/schemas/training_session_schema';
import { EmailService } from '../services/email.service'; // 👈 Import the Service Class

import { VideoSessionsController } from './video-session.controller';
import { VideoSessionsService } from './video-session.service';

@Module({
  imports: [
    // 1. MongooseModule is still needed to provide the TrainingSessionModel
    MongooseModule.forFeature([
      { name: TrainingSession.name, schema: TrainingSessionSchema },
    ]),
  ],
  controllers: [VideoSessionsController],
  providers: [
    VideoSessionsService, // The service being provided by this module

    // ✅ FIX: Inject the EmailService here so it can be resolved
    EmailService,
  ],
})
export class VideoSessionModule { }