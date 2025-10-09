import {Controller, Post, Body, Get, Param, Sse, Query, MessageEvent, Delete, HttpStatus, Res} from '@nestjs/common';
import { TimerService } from './TimerService';
import { CreateTimerDto } from './create-timer.dto';
import {interval, Observable, takeWhile} from "rxjs";
import { map } from 'rxjs/operators';
import { Response } from "express";
import {Public} from "../common/decorators";

@Controller('timer')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

    @Public()
  @Post('start')
  async startTimer(@Body() timerData: {id: string; seconds: number}): Promise<{ message: string }> {
    console.log(timerData.id, timerData.seconds)
    this.timerService.startTimer(timerData.id, timerData.seconds);
    return { message: 'Timer started!' };
  }

  @Public()
  @Get('get-time/:id')
  async getTimers(@Param('id') id: string): Promise<Object> {
    const remainingTime = this.timerService.getTimer(id);
    if (remainingTime !== null){
        return {id, remainingTime};
    } else {
        return {message: 'Timer not found'}; 
    }
  }

  @Public()
  @Delete('remove-timer/:id')
  async removeTimer(@Param('id') id: string, @Res() res: Response): Promise<void> {
      const status = this.timerService.stopTimer(id);
      if (status) {
          res.status(200)
          res.send({ message: 'Timer stopped!'})
      } else {
          res.status(500)
          res.send({ message: 'Error in removing timer'} )
      }
  }

  @Public()
  @Sse('get-time-stream')
  StreamTimer(@Query('id') id: string): Observable<MessageEvent> {
    return interval(1000).pipe(
        map(() => {
          const remainingTime = this.timerService.getTimer(id);
          return { data: {id, remainingTime } };
        }),
        takeWhile(event => event.data.remainingTime !== null && event.data.remainingTime > 0)
    );
  }
}
