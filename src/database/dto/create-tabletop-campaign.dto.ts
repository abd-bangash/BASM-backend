import { Schema } from "mongoose";
import { questions } from "src/Tabletop/question.interface";
import { IsNotEmpty } from 'class-validator';

export class CreateTabletopCampaignDto {

    @IsNotEmpty()
    readonly clientName: string;
    readonly clientId: Schema.Types.ObjectId;
    readonly clientUsername: string;
    readonly campaignName: string;
    readonly campaignType: string;
    readonly isCompleted: boolean;
    readonly isRunning: boolean;
    readonly questions: questions[];
}

export class QuestionNumberDto {
    campaignId: string;
    questionNumber: number;
}