import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as mongooseSchema } from 'mongoose';

export type TrainingSessionDocument = HydratedDocument<TrainingSession>;

@Schema({ collection: 'trainingSessions' })
export class TrainingSession {
    @Prop({ required: true })
    userEmail: string;

    @Prop({ type: mongooseSchema.Types.ObjectId, ref: 'Tabletop', required: true })
    campaignId: mongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    categoryName: string;

    @Prop({ required: true })
    token: string; // unique per session for email link

    @Prop({ default: 0 })
    progress: number; // in seconds

    // optional: store actual video URL/path for the session
    @Prop()
    videoPath?: string;

    @Prop({ type: [mongooseSchema.Types.Mixed], default: [] })
    videoResponses: {
        questionId: string;
        answer: string;
        timestamp: number;
        submittedAt: Date;
    }[];

    @Prop({ default: 'pending' })
    status: 'pending' | 'in_progress' | 'completed' | 'passed' | 'failed';

    @Prop({ default: null })
    retestScore: number | null;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const TrainingSessionSchema = SchemaFactory.createForClass(TrainingSession);
