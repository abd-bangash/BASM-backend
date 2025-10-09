import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { DashboardlogicsService } from './dashboardlogics.service';
import { JwtAuthGuard } from 'src/auth/guards';

@Controller('dashboardlogics')
export class DashboardlogicsController {
  constructor(private readonly dashboardlogicsService: DashboardlogicsService) {} // 👈 yahan naam same rakha

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getDashboardStats() {
    return await this.dashboardlogicsService.getDashboardStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('search-count')
  async getsearch(@Query('source') source?: string) {
    return await this.dashboardlogicsService.getsearchCount(source);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-search')
  async addSearch(@Body() body: any) {
    console.log("backend received", body);
    return this.dashboardlogicsService.savesearch(
      body.keyword,
      body.resultLength,
      body.source,
    );
  }
}
