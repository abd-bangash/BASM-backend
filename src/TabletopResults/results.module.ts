import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { TabletopResults, TabletopResultsSchema } from '../database/schemas/results.schema';
import { TrainingSession, TrainingSessionSchema } from '../database/schemas/training_session_schema';
import { CategoryVideo, CategoryVideoSchema } from '../database/schemas/category_video_schema'
import { TabletopModule } from "../Tabletop/tabletop.module";
import { DefaultQuestionsModule } from "../DefaultQuestions/dQuestions.module";
import { TabletopAttendance, tt_attendance_Schema } from '../database/schemas/tabletop_attendance.schema';
import { EmailService } from '../services/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TabletopResults.name, schema: TabletopResultsSchema },
      { name: TabletopAttendance.name, schema: tt_attendance_Schema },
      { name: TrainingSession.name, schema: TrainingSessionSchema },
      { name: CategoryVideo.name, schema: CategoryVideoSchema },

    ]),
    TabletopModule,
    DefaultQuestionsModule
  ],
  controllers: [ResultsController],
  providers: [ResultsService, EmailService],
  exports: [ResultsService],
})
export class ResultsModule { }
