import {ObjectId} from "mongoose";

export class TabletopResultsDto{
    campaignId: string;
    questionId: ObjectId;
    userId: string;
    questionNumber: string;
    category: string;
    userAnswer: string[];
    correctAnswer: string[];
}