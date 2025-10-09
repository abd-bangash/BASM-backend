import { Module } from '@nestjs/common';
import { TabletopSessionsService } from './tabletop-sessions.service';
import {MongooseModule} from "@nestjs/mongoose";
import {TabletopSessionsSchema} from "../database/schemas/tabletop-sessions.schema";

@Module({
  imports: [
      MongooseModule.forFeature([{name: 'tabletopSessionsCollection', schema: TabletopSessionsSchema}])
  ],
  providers: [TabletopSessionsService],
})
export class TabletopSessionsModule {}
