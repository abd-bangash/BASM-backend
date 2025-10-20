import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as mongooseSchema } from 'mongoose';

export type CategoryVideoDocument = HydratedDocument<CategoryVideo>;

@Schema({ collection: 'categoryVideos' })
export class CategoryVideo {
    @Prop({ required: true })
    categoryName: string; // e.g. "phishing"

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    filePath: string; // /uploads/videos/phishing.mp4

    @Prop({ type: [mongooseSchema.Types.Mixed], default: [] })
    interactiveQuestions: {
        id: string;
        timestamp: number;
        question: string;
        options: string[];
        correctAnswer: string;
    }[];
}

export const CategoryVideoSchema = SchemaFactory.createForClass(CategoryVideo);
