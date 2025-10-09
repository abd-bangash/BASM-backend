import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type tt_attendance_Document = HydratedDocument<TabletopAttendance>;
//tabletop attendance collection
@Schema({ collection: 'Tt_attendance_Collection' })
export class TabletopAttendance {
   @Prop({ required: true }) first_name: string;
   @Prop({ required: true }) last_name: string;
   @Prop({ required: true }) campaignId: string;
   @Prop({ required: true }) designation: string;
   @Prop({ required: true }) dateAdded: Date;
   @Prop({ required: true }) email: string;
}

export const tt_attendance_Schema = SchemaFactory.createForClass(TabletopAttendance);

