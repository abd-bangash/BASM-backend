import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { TrainingService } from './training.service';
import { TrainingTokenGuard } from '../auth/guards/training-token.guard';
import { Request } from 'express';

@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get()
  @UseGuards(TrainingTokenGuard)
  getTrainingSession(@Req() req: Request) {
    const user = req.user as { userId: string; campaignId: string };
    return this.trainingService.getTrainingSession(user.userId, user.campaignId);
  }
}
