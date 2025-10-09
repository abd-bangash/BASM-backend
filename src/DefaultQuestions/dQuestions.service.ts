import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionDocument } from "../database/schemas/question.schema";

@Injectable()
export class dQuestionsService{
    constructor(@InjectModel('DefaultQuestions') private readonly defaultQuestion: Model<QuestionDocument>){}
    
    async getAllQuestions(): Promise<QuestionDocument[]>{
        return this.defaultQuestion.find().exec();
    }
}