import mongoose from "mongoose";
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type QRCodeDocument = HydratedDocument<QRCode>;

@Schema({collection: 'QRCodeCollection'})
export class QRCode{
    @Prop({ required:true })
    qrCode: string;

    @Prop({required: true})
    campaignId: mongoose.Types.ObjectId;
}

export const QRCodeSchema = SchemaFactory.createForClass(QRCode);