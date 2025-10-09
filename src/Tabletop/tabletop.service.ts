import {HttpException, Inject, Injectable, NotFoundException} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, {Model, ObjectId} from "mongoose";
import {CreateTabletopCampaignDto, QuestionNumberDto} from "../database/dto/create-tabletop-campaign.dto";
import { questions } from "./question.interface";
import {Tabletop, TabletopQuestionNumberDocument} from "../database/schemas/tabletop.schema";

@Injectable()
export class TabletopService{
    constructor(
        @InjectModel('tabletopCollections') private readonly tabletopModel: Model<Tabletop>,
        @InjectModel('TabletopQuestionNumberCollection') private readonly tabletopQuestionNumberModel: Model<TabletopQuestionNumberDocument>
    )
{}

    async addTableTopCampaign(createTableTopDto: CreateTabletopCampaignDto): Promise<object>{
        const newCampaign = new this.tabletopModel(createTableTopDto);
        try{
            await newCampaign.save();
            return {message: 'ok'}
        } catch (err) {
            console.log(err);
            return Promise.reject({message: 'Message Error. Please view logs.'});
        }
    }

    async getAllCampaignData(): Promise<Tabletop[]> {
        return this.tabletopModel.find().exec();

    }

    async getCampaignDataById(id: string): Promise<Tabletop> {
        return this.tabletopModel.findById(id).exec();
    }

    async getCampaignDataByClientId(id: string): Promise<Tabletop[]> {
        let mongooseId: mongoose.Types.ObjectId;
        try {
            mongooseId = new mongoose.Types.ObjectId(id);
            return this.tabletopModel.find({ clientId: mongooseId });
        }
        catch (e) {
            console.log("An error has occurred: ");
            console.error(e);
            return null;
        }
    }

    async getCampaignDataByClientName(name: string): Promise<Tabletop[]> {
        try {
            return this.tabletopModel.find({ clientName: name  });
        }
        catch (e) {
            console.log("An error has occurred: ");
            console.error(e);
            return null;
        }
    }

    async getCompletedCampaignDataByClientId(id: string): Promise<Tabletop[]> {
        let mongooseId: mongoose.Types.ObjectId;
        try {
            mongooseId = new mongoose.Types.ObjectId(id);
            return this.tabletopModel.find({ clientId: mongooseId, isCompleted: true });
        }
        catch (e) {
            console.log("An error has occurred: ");
            console.error(e);
            return null;
        }
    }

    async getCompletedCampaignDataByClientName(name: string): Promise<Tabletop[]> {
        try {
            return this.tabletopModel.find({ clientName: name, isCompleted: true });
        }
        catch (e) {
            console.log("An error has occurred: ");
            console.error(e);
            return null;
        }
    }

    async getCampaignDataByUsername(username: string): Promise<Tabletop[]>{
        return this.tabletopModel.find({clientUsername: username}).exec();
    }

    async getQuestionDataByCampaignName(name: string): Promise<questions[]>{
        const campaign = await this.tabletopModel.findOne({campaignName: name}).exec();
        return campaign.questions;
    }

    async getQuestionDataByCampaignId(id: string): Promise<questions[]> {
        let _id: mongoose.Types.ObjectId;
        try {
            _id = new mongoose.Types.ObjectId(id);
        }
        catch (e) {
            console.log ("Invalid ID provided");
            console.error(e);
        }
        const campaignData = await this.tabletopModel.findOne({_id: _id}).exec();
        let campaignQuestions = [];
        campaignData.questions.forEach((question) => {
            question.questions.forEach((singleQuestion) => {
                singleQuestion['category'] = question.category;
                campaignQuestions.push(singleQuestion);
            })
        });
        return campaignQuestions;
    }

    /**
     * Updates the 'isRunning' field of a tabletop campaign identified by the given ID.
     *
     * @param {string} id - The ID of the tabletop campaign to update.
     * @param {boolean} isRunning - The new value for the 'isRunning' field.
     * @returns {Promise<Tabletop>} - A promise that resolves to the updated tabletop campaign.
     * @throws {NotFoundException} - If the tabletop campaign with the given ID is not found.
     */
    async updateIsRunning(id: string, isRunning: boolean): Promise<Tabletop> {
        let campaignId: mongoose.Types.ObjectId;
        try {
            campaignId = new mongoose.Types.ObjectId(id);
        }
        catch (e) {
            console.log("Error at converting campaign ID to mongoose object ID");
            console.log(e);
            throw new HttpException('Invalid campaign ID', 400);
        }
        const updatedCampaign = await this.tabletopModel.findByIdAndUpdate(
            campaignId,
            { isRunning },
            { new: true },
        );

        if (!updatedCampaign) {
            throw new NotFoundException('Tabletop campaign not found');
        }

        return updatedCampaign;
    }

    async updateTabletopCompletionStatus(id: string, isCompleted: boolean) {
        let mongooseId: mongoose.Types.ObjectId;
        try {
            mongooseId = new mongoose.Types.ObjectId(id);
            const updatedCampaign = await this.tabletopModel.findByIdAndUpdate(
                {_id: mongooseId},
                { isCompleted },
                { new: true },
            )
            console.log("Campaign completion status successfull.");
            console.log(updatedCampaign);
            return updatedCampaign;
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }

    async fetchCampaignCompletionStatus(id: string) {
        let mongooseId: mongoose.Types.ObjectId;
        try {
            mongooseId = new mongoose.Types.ObjectId(id);
            const updatedCampaign = await this.tabletopModel.findOne({_id: mongooseId});
            return updatedCampaign.isCompleted;
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }

    async getCampaignStatus(campaignId: string): Promise<boolean | number> {
        let _campaignId: mongoose.Types.ObjectId | undefined = undefined;

        try {
            _campaignId = new mongoose.Types.ObjectId(campaignId);
            console.log(_campaignId)
        }
        catch (e) {
            console.log("Unable to convert string to object id. Invalid Campaign ID: ", campaignId);
            console.error(e);
            return 402;
        }

        const tabletopCampaign = await this.tabletopModel.findOne({_id: _campaignId._id}).exec();
        if (tabletopCampaign === null) {
            return 404;
        }

        return tabletopCampaign.isRunning;
    }

    async addQuestionNumber(questionNumberDto: QuestionNumberDto) {
        try {
            const _campaignId = new mongoose.Types.ObjectId(questionNumberDto.campaignId);
        }
        catch (e) {
            console.log ("Unable to convert ", questionNumberDto.campaignId, " to mongoose object ID");
            console.error(e);
        }

        const questionNumberDocument = new this.tabletopQuestionNumberModel(questionNumberDto);

        try {
            await questionNumberDocument.save();
            return {message: 'ok'};
        }
        catch (e) {
            console.log("Unable to store question number data into mongoose collection.")
            console.error(e);
        }
        return {message: 'error'};
    }

    async fetchQuestionNumber(campaignId: string) {
        console.log("Got campaign ID: ", campaignId);
        return this.tabletopQuestionNumberModel.findOne({campaignId: campaignId}).exec();
    }

    async updateQuestionNumber(campaignId: string) {
        const questionNumberDoc = await this.tabletopQuestionNumberModel.findOne({campaignId: campaignId}).exec();
        const updatedQuestionNumber = questionNumberDoc.questionNumber + 1;
        try {
            console.log("trying to update question number to ", updatedQuestionNumber);
            await questionNumberDoc.updateOne({questionNumber: updatedQuestionNumber });
            await questionNumberDoc.save();
            return {message: 'ok'};
        }
        catch (e) {
            console.error(e);
        }
        return {message: 'error'};
    }

    async deleteQuestionNumber(campaignId: string ) {
        return await this.tabletopQuestionNumberModel.deleteOne({campaignId: campaignId}).exec();
    }
 }
