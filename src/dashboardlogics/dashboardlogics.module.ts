import { Module } from '@nestjs/common';
import { DashboardlogicsController } from './dashboardlogics.controller';
import { DashboardlogicsService } from './dashboardlogics.service';
import { Tabletop,TabletopSchema } from 'src/database/schemas/tabletop.schema';
import { TabletopResults,TabletopResultsSchema } from 'src/database/schemas/results.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Search,SearchSchema } from 'src/database/schemas/search.schema';


@Module({
  imports:[
    MongooseModule.forFeature([
      {name: Tabletop.name,schema: TabletopSchema},
      {name:TabletopResults.name,schema:TabletopResultsSchema},
      { name: Search.name, schema: SearchSchema },
    ]),
  ],
  controllers: [DashboardlogicsController],
  providers: [DashboardlogicsService]
})
export class DashboardlogicsModule {}
