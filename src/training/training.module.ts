import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TabletopAttendance, tt_attendance_Schema } from '../database/schemas/tabletop_attendance.schema';
import { CategoryVideo, CategoryVideoSchema } from '../database/schemas/category_video_schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: TabletopAttendance.name, schema: tt_attendance_Schema },
      { name: CategoryVideo.name, schema: CategoryVideoSchema },
    ]),
  ],
  controllers: [TrainingController],
  providers: [TrainingService],
})
export class TrainingModule {}
