import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OtxService } from './otx.service';
import { OtxController } from './otx.controller';
import {Breach_monitoringService} from "../Breach_monitoring/breach_monitoring.service";

@Module({
    imports: [HttpModule], // Enable HttpModule for making HTTP requests
    providers: [OtxService],
    controllers: [OtxController],
    exports: [OtxService]
})
export class OtxModule {}
