import { Injectable, } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Interval, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TimerService {
  private timers: Map<string, number> = new Map();
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  /* Get the name of the cronjob and the seconds of which to set
  the timer to. Once that is done */ 
  startTimer(id: string, seconds: number) {
    this.timers.set(id, seconds);
    const job = new CronJob('* * * * * *', () => {
      let remainingTime = this.timers.get(id);
      if (remainingTime <= 0) {
        console.log(`${id} timer finished!`);
        job.stop();
        this.schedulerRegistry.deleteCronJob(id);
        this.timers.delete(id);
      } else {
        remainingTime--;
        this.timers.set(id, remainingTime);
      }
    });

    this.schedulerRegistry.addCronJob(id, job);
    job.start();
  }

  stopTimer(id: string) {
    try {
      // Get the job from the registry
      const job = this.schedulerRegistry.getCronJob(id);

      if (job) {
        // Stop the job
        job.stop();

        // Remove from registry
        this.schedulerRegistry.deleteCronJob(id);

        // Remove from timers Map
        this.timers.delete(id);

        console.log(`Timer ${id} has been stopped and removed`);
        return true;
      }
    } catch (error) {
      console.error(`Failed to stop timer ${id}: ${error.message}`);
    }

    return false;
  }

  getTimer(id: string): number | null {
    return this.timers.get(id) ?? null;
  }
}