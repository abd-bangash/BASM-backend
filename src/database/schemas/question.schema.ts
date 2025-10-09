import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as mongooseSchema } from 'mongoose';

export interface TabletopQuestion {
    number: string;
    question: string;
    options: mongooseSchema.Types.Mixed;
    correctAnswer: string;
}

export type QuestionDocument = HydratedDocument<Question>;

@Schema({collection: 'DefaultQuestions'})
export class Question{
    @Prop({required: true})
    category: string;

    @Prop({required: true})
    questions: TabletopQuestion[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);