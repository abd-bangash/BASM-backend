import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TabletopAttendance, tt_attendance_Schema } from '../database/schemas/tabletop_attendance.schema';
import { CategoryVideo, CategoryVideoSchema } from '../database/schemas/category_video_schema';
import { TabletopModule } from '../Tabletop/tabletop.module';
import { DefaultQuestionsModule } from '../DefaultQuestions/dQuestions.module';
import { EmailService } from '../services/email.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: TabletopAttendance.name, schema: tt_attendance_Schema },
      { name: CategoryVideo.name, schema: CategoryVideoSchema },
    ]),
    TabletopModule,
    DefaultQuestionsModule,
  ],
  controllers: [TrainingController],
  providers: [TrainingService, EmailService],
})
export class TrainingModule {}
