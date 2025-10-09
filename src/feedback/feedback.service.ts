// src/feedback/feedback.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback } from 'src/database/schemas/feedback.schema';
import { FeedbackDocument } from 'src/database/schemas/feedback.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
  ) {}

  async createFeedback(
    userId: string | null,
    msgId: string,
    questionNo: number,
    feedbackText: string,
    attendanceId: string,
  ): Promise<Feedback> {
    if (!Types.ObjectId.isValid(attendanceId)) {
      throw new BadRequestException('Invalid attendanceId provided');
    }

    if (!feedbackText?.trim()) {
      throw new BadRequestException('Feedback text cannot be empty');
    }

    const feedbackData: any = {
      msgId,
      questionNo,
      feedbackText,
      attendanceId: new Types.ObjectId(attendanceId),
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      feedbackData.userId = new Types.ObjectId(userId);
    }

    const newFeedback = new this.feedbackModel(feedbackData);
    return newFeedback.save();
  }
}
