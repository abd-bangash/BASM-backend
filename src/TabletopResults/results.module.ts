import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { TabletopResults, TabletopResultsSchema } from '../database/schemas/results.schema';
import {TabletopModule} from "../Tabletop/tabletop.module";
import {DefaultQuestionsModule} from "../DefaultQuestions/dQuestions.module";
import { TabletopAttendance, tt_attendance_Schema } from '../database/schemas/tabletop_attendance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TabletopResults.name, schema: TabletopResultsSchema },
      { name: TabletopAttendance.name, schema: tt_attendance_Schema }
    ]),
    TabletopModule,
    DefaultQuestionsModule
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}
