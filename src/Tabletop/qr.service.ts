import { Injectable } from "@nestjs/common";
import * as QRCodeLib from 'qrcode';
import {QRCode} from '../database/schemas/qr.schema';
import mongoose, {Model, ObjectId} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {QRCodeModule} from "./qr.module";
import {Tabletop} from "../database/schemas/tabletop.schema";

/*
Generate a QR Code:
Call the GET /qrcode/generate?data=someData
endpoint to generate a QR code.
Scan and Save Device ID:

When the QR code is scanned by a device,
make a POST /scan/save request with the qrCode 
and deviceId in the request body.

Save the QR code for the specific campaign in the database so that the qr code is not
regenerated on page reload.
*/
@Injectable()
export class QRCodeService{
    constructor(@InjectModel(QRCode.name) private qrcodeModel: Model<QRCode>) {}

    async generateQRCode(campaignId: mongoose.Types.ObjectId, data: string): Promise<string>{
        try {
            // Generate QR code as a data URL
            const qrcode = await QRCodeLib.toString(data, {
                scale: 10,
                type: 'svg',
                margin: 2
            });
            const new_qrcode = new this.qrcodeModel({qrCode: qrcode, campaignId: campaignId});
            try {
                await new_qrcode.save();
                console.log('Saved to database qrcode')
                return qrcode;
            }
            catch(err){
                return Promise.reject({message: 'Message Error. Could not save QRCode to database.'});
            }
        } catch (err) {
            throw new Error(`Error generating QR code: ${err.message}`);
        }
    }

    async getQRCodeByCampaignId(id: string): Promise<QRCode> {
        let campaignId: mongoose.Types.ObjectId;
        try {
            campaignId = new mongoose.Types.ObjectId(id);
        }
        catch (e){
            console.log("Error at converting campaign ID to mongoose object ID - getQRCodeByCampaignId()");
        }
        return this.qrcodeModel.findOne({ campaignId: campaignId }).exec();
    }

    async deleteQRCodeByCampaignId(id: string): Promise<mongoose.mongo.DeleteResult> {
        let campaignId: mongoose.Types.ObjectId;
        try {
            campaignId = new mongoose.Types.ObjectId(id);
        }
        catch (e) {
            console.log("Error at converting campaign ID to mongoose object ID - deleteQRCodeByCampaignId()");
        }
        return this.qrcodeModel.deleteOne({ campaignId: campaignId }).exec();
    }
}