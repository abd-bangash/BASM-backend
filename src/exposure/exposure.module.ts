import { Module } from '@nestjs/common';
import { ExposuresController } from './exposure.controller';
import { ExposureService } from './exposure.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule], // Importing ConfigModule if you use environment variables
    controllers: [ExposuresController],
    providers: [ExposureService],
    exports: [ExposureService]
})
export class ExposuresModule {}
