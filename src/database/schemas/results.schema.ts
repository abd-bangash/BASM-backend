import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mongooseSchema } from 'mongoose';

export type TabletopResultsDocument = HydratedDocument<TabletopResults>;

@Schema({ collection: 'tabletopResultsCollection' })
export class TabletopResults {
    @Prop({ required: true })
    campaignId: mongoose.Types.ObjectId

    @Prop({ required: true })
    userId: string

    @Prop({ required: true })
    totalMarks: number;

    @Prop({ required: true })
    obtainedMarks: number;

    @Prop({ required: true })
    categoryScore: mongooseSchema.Types.Mixed;

}
export const TabletopResultsSchema = SchemaFactory.createForClass(TabletopResults);