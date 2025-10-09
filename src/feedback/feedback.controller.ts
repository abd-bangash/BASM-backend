// src/feedback/feedback.controller.ts
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/guards';
import { Request } from 'express';
import { Public } from 'src/common/decorators';

@Controller('feedback')
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Public()
  @Post()
  async submitFeedback(
    @Req() req: Request,
    @Body() body: { feedbackText: string; attendanceId: string; questionId: number }
  ) {
    const user = req.user as any || null;
    const userId = user?.sub || user?._id || user?.id || null;

    const msgId = 'msg_' + Math.random().toString(36).substring(2, 8);
    const questionNo = body.questionId;

    return this.feedbackService.createFeedback(
      userId,
      msgId,
      questionNo,
      body.feedbackText.trim(),
      body.attendanceId
    );
  }
}
