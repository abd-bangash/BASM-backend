import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionDocument, TabletopQuestion } from "../database/schemas/question.schema";

@Injectable()
export class dQuestionsService{
    constructor(@InjectModel('DefaultQuestions') private readonly defaultQuestion: Model<QuestionDocument>){}
    
    async getAllQuestions(): Promise<QuestionDocument[]>{
        return this.defaultQuestion.find().exec();
    }

    async getQuestionsByCategory(category: string): Promise<TabletopQuestion[]> {
        // Use a case-insensitive regex to find the category
        const result = await this.defaultQuestion.findOne({ category: new RegExp(`^${category}$`, 'i') }).exec();
        if (result) {
            // Use the original category string passed to the function to preserve casing.
            result.questions.forEach(q => q['category'] = category);
            return result.questions;
        }
        return [];
    }
}