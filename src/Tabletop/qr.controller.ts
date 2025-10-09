import {Body, Controller, Delete, Get, Param, Post, Query, Req, Res} from "@nestjs/common";
import { QRCodeService } from './qr.service';
import { Request, Response } from 'express';
import mongoose from "mongoose";




@Controller('qrcode')
export class QRCodeController{
    constructor(private readonly qrCodeService : QRCodeService) {}


    @Post('generate')
    async generateQRCode(@Body() requestData: {campaignId: string; data: string}, @Res() res: Response, @Req() req: Request) {
        let id: mongoose.Types.ObjectId;
        try {
            id = new mongoose.Types.ObjectId(requestData.campaignId);
        }
        catch(err){
            console.log(err);
            return res.status(400).send({ message: 'Invalid campaign ID' });
        }
        console.log(id);

        // Generate QR code
        const qrCode = await this.qrCodeService.generateQRCode(id, requestData.data);
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(qrCode);

        // Save campaignId in the session
        //req.session.campaignId = id.toString(); // Store as string in session
        //console.log(`Session campaignId: ${req.session.campaignId}`);

    }
    // @Get(':campaignId')
    // async joinCampaign(@Param('campaignId') campaignId: string, @Session() session: Record<string, any>) {
    //     session.campaignId = campaignId;
    //     // Generate a unique user ID for the session
    //     session.userId = await this.qrcodeService.generateUniqueUserId();
    //     return { message: 'Joined campaign successfully' };
    // }

// Retrieves the QR code by campaign ID and persists the session
    @Get()
    async getQrcodeByCampaignId(@Query('campaign-id') campaignId: string, @Res() res: Response, @Req() req:Request) {
        const qrCode = await this.qrCodeService.getQRCodeByCampaignId(campaignId);
        if (qrCode === null){
            res.status(404);
            return res.send({ message: 'Campaign does not exist' })
        }
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(qrCode.qrCode);
    }
  
    @Delete('/delete/:id')
    async deleteQRCode(@Param('id') id: string, @Res() res: Response) {
        const deleteResult = await this.qrCodeService.deleteQRCodeByCampaignId(id);
        console.log(deleteResult);
        if (deleteResult['deletedCount'] === 0) {
            res.status(404);
            res.send({ message: 'Resource not found.'})
        } else if (deleteResult['deletedCount'] === 1) {
            res.status(200);
            res.send({ message: 'Deletion Successful'})
        } else {
            res.status(500).send(deleteResult);
            return { message: 'Unknown Error' }
        }
    }
}