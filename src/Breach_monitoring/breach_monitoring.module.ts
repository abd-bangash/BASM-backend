// breach_monitoring.module.ts
import { Module } from '@nestjs/common';
import { Breach_monitoringService } from './breach_monitoring.service';
import { Breach_monitoringController } from './breach_monitoring.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot()],
    providers: [Breach_monitoringService],
    controllers: [Breach_monitoringController],
    exports: [Breach_monitoringService]
})
export class Breach_monitoringModule {}
