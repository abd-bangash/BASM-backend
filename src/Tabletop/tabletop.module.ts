import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {QuestionNumberSchema, TabletopSchema} from '../database/schemas/tabletop.schema';
import { TabletopService } from './tabletop.service';
import { TabletopController } from './tabletop.controller';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
        { name: 'tabletopCollections', schema: TabletopSchema },
        { name: 'TabletopQuestionNumberCollection', schema: QuestionNumberSchema}
    ]),
  ],
  controllers: [TabletopController],
  providers: [TabletopService],
  exports: [TabletopService],
})
export class TabletopModule {}
