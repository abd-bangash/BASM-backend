// qr.module.ts
import { Module } from '@nestjs/common';
import { QRCodeController } from './qr.controller';
import { QRCodeService } from './qr.service';
import { MongooseModule } from '@nestjs/mongoose';
import {QRCode, QRCodeSchema} from '../database/schemas/qr.schema';

@Module({
  imports: [
      MongooseModule.forFeature([{ name: QRCode.name, schema: QRCodeSchema }])
  ],
  controllers: [QRCodeController],
  providers: [QRCodeService],
  exports: [QRCodeService],
})
export class QRCodeModule {}