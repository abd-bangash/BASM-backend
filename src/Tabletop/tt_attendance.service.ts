import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { tt_attendance_Dto } from 'src/database/dto/tt_attendance.dto';
import { TabletopAttendance } from '../database/schemas/tabletop_attendance.schema';

@Injectable()
export class tt_attendance_Service {
  constructor(
    @InjectModel('Tt_attendance_Collection')
    private readonly attendanceModel: Model<TabletopAttendance>
  ) { }

  async create(attendanceDto: tt_attendance_Dto): Promise<TabletopAttendance> {
    // console.log("📩 Data received in service:", attendanceDto);

    const attendanceToSave = {
      ...attendanceDto,
      dateAdded: new Date()
    };

    const newAttendance = new this.attendanceModel(attendanceToSave);
    return newAttendance.save();
  }


  async findById(id: string): Promise<TabletopAttendance> {
    const attendance = await this.attendanceModel.findById(id).exec();
    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    return attendance;
  }

  async findAll(): Promise<TabletopAttendance[]> {
    return this.attendanceModel.find().exec();
  }
}
