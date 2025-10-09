import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { tt_attendance_Controller } from './tt_attendance.controller';
import { tt_attendance_Service } from './tt_attendance.service';
import { tt_attendance_Schema } from 'src/database/schemas/tabletop_attendance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Tt_attendance_Collection', schema: tt_attendance_Schema },
    ]),
  ],
  controllers: [tt_attendance_Controller],
  providers: [tt_attendance_Service],
  exports: [tt_attendance_Service], // optional: export service if used elsewhere
})
export class tt_attendance_Module {}
