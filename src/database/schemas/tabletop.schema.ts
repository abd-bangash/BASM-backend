import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as mongooseSchema } from 'mongoose';
import {Question, QuestionSchema} from './question.schema';
import { questions } from '../../Tabletop/question.interface';

export type TabletopDocument = HydratedDocument<Tabletop>;
export type TabletopQuestionNumberDocument = HydratedDocument<QuestionNumber>;

@Schema({collection: 'tabletopCollections'})
export class Tabletop{
  @Prop({required: true})
  clientName: string;

  @Prop({ type: mongooseSchema.Types.ObjectId, required: true, ref: 'ClientsCollection' })
  clientId: mongooseSchema.Types.ObjectId;

  @Prop({required: true})
  clientUsername: string

  @Prop({required: true})
  campaignName: string

  @Prop({ required: true })
  tabletopCategory: string;

  @Prop({ required: true })
  isRunning: boolean;

  @Prop({required: true})
  isCompleted: boolean;

  @Prop({required: true})
  dateCreated: Date;

  @Prop({ type: [QuestionSchema], required: true })
  questions: questions[];
}

@Schema({collection: 'TabletopQuestionNumberCollection'})
export class QuestionNumber {
  @Prop({required: true})
  campaignId: string;

  @Prop({required: true})
  questionNumber: number;
}

export const TabletopSchema = SchemaFactory.createForClass(Tabletop);
export const QuestionNumberSchema = SchemaFactory.createForClass(QuestionNumber);