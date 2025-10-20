import { Controller, Get, Post, Body, Query, Patch } from '@nestjs/common';
import { VideoSessionsService } from './video-session.service';

@Controller('video-sessions')
export class VideoSessionsController {
    constructor(private readonly videoSessionService: VideoSessionsService) { }

    @Get()
    async getSession(@Query('token') token: string) {
        return this.videoSessionService.getSessionByToken(token);
    }

    @Patch('progress')
    async updateProgress(@Body() body) {
        return this.videoSessionService.updateProgress(body.token, body.progress);
    }

    @Patch('complete')
    async markComplete(@Body() body) {
        return this.videoSessionService.markCompleted(body.token);
    }
}
