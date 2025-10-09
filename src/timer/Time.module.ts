import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { TimerService } from './TimerService';
import { TimerController } from './TimerController';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Necessary for the cron jobs
  ],
  controllers: [TimerController],
  providers: [TimerService],
  exports: [TimerService]
})
export class TimerModule {}
