// src/database/schemas/feedback.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId;

  @Prop({ required: true })
  msgId: string;

  @Prop({ required: true })
  questionNo: number;

  @Prop({ required: true })
  feedbackText: string;

  @Prop({ type: Types.ObjectId, ref: 'Attendance', required: true })
  attendanceId: Types.ObjectId;
}

export type FeedbackDocument = Feedback & Document;
export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
