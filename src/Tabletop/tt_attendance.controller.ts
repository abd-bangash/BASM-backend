import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { tt_attendance_Service } from './tt_attendance.service';
import { tt_attendance_Dto } from 'src/database/dto/tt_attendance.dto';
import { Public } from 'src/common/decorators';

@Controller('tabletop-attendance')
export class tt_attendance_Controller {
  constructor(private readonly attendanceService: tt_attendance_Service) {}
 
 
  @Public()
  @Post()
async createAttendance(@Body() dto: tt_attendance_Dto): Promise<any> {
    return this.attendanceService.create(dto);
}

@Public()
  @Get(':id')
  async getAttendance(@Param('id') id: string): Promise<tt_attendance_Dto> {
    return this.attendanceService.findById(id);
  }

  @Get()
  async getAllAttendances(): Promise<tt_attendance_Dto[]> {
    return this.attendanceService.findAll();
  }
}
