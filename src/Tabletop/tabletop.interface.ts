import { Document } from "mongoose";
import { questions } from "./question.interface";

export interface tabletop extends Document{
    readonly companyName: string;
    readonly companyId: string;
    readonly campaignName: string;
    readonly campaignType: string;
    readonly questions: questions[];
}