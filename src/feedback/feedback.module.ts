// src/feedback/feedback.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Feedback } from 'src/database/schemas/feedback.schema';
import { FeedbackSchema } from 'src/database/schemas/feedback.schema';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Feedback.name, schema: FeedbackSchema }])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
