import { Body, Controller, Patch, Get, Post, Query, UseGuards, Param, Res, HttpStatus, Delete } from '@nestjs/common';
import { CreateTabletopCampaignDto, QuestionNumberDto } from 'src/database/dto/create-tabletop-campaign.dto';
import { TabletopService } from './tabletop.service';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Response } from 'express';
import { Role } from "../auth/roles.enum";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from '../auth/roles.decorator'
import { Public } from "../common/decorators";
@Controller('tabletop')
export class TabletopController {
    constructor(private tabletopService: TabletopService) { }

    @Get()
    async getHello(): Promise<string> {
        return 'Hello from tabletop';
    }

    // @UseGuards(JwtAuthGuard)
    @Post('campaign/create')
    //  @Roles(Role.Admin)
    async create(@Body() createTableTopDto: CreateTabletopCampaignDto) {
        return await this.tabletopService.addTableTopCampaign(createTableTopDto);
    }
    /*
        @Get('generate-qrcode')
        async generateQRcode(@Query('text') text: string): Promise<string>{
            try{
                const qrCodeImage = await this.tabletopService.qrcode_gen(text || 'default text');
                return `<img src="${qrCodeImage}" alt="QR Code"/>`;
            } catch (err){
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);

            }
        }
        */

    @Public()
    @Get('campaigns')
    async getAllCampaigns() {
        return this.tabletopService.getAllCampaignData();
    }

    // @UseGuards(JwtAuthGuard)
    @Public()
    @Get('campaigns/:id')
    async getCampaignById(@Param('id') id: string) {
        return this.tabletopService.getCampaignDataById(id);
    }

    @Public()
    @Get('campaigns/client/:id')
    async getCampaignsByClientId(@Param('id') client_id: string, @Res() res: Response) {
        const campaign_data = await this.tabletopService.getCampaignDataByClientId(client_id);
        console.log(campaign_data);
        if (campaign_data === null || campaign_data.length === 0) {
            res.status(HttpStatus.NOT_FOUND).send();
        }
        else {
            res.status(HttpStatus.OK).send(campaign_data);
        }

    }

    @Get('campaigns/completed/client/:id')
    async getCompletedCampaignsByClientId(@Param('id') id: string, @Res() res: Response) {
        const campaign_data = await this.tabletopService.getCompletedCampaignDataByClientId(id);
        if (campaign_data === null || campaign_data.length === 0) {
            res.status(HttpStatus.NOT_FOUND).send();
        } else {
            res.status(HttpStatus.OK).send(campaign_data);
        }
    }

    @Get('campaigns/completed/client/name/:name')
    async getCompletedCampaignsByClientName(@Param('name') name: string, @Res() res: Response) {
        const campaign_data = await this.tabletopService.getCompletedCampaignDataByClientName(name);
        if (campaign_data === null || campaign_data.length === 0) {
            res.status(HttpStatus.NOT_FOUND).send();
        } else {
            res.status(HttpStatus.OK).send(campaign_data);
        }
    }

    @Get('campaigns/name/:name')
    async getCampaignsByClientName(@Param('name') name: string, @Res() res: Response) {
        const campaign_data = await this.tabletopService.getCampaignDataByClientName(name);
        console.log(campaign_data);
        if (campaign_data === null || campaign_data.length === 0) {
            res.status(HttpStatus.NOT_FOUND).send();
        }
        else {
            res.status(HttpStatus.OK).send(campaign_data);
        }

    }

    @Public()
    @Get('campaigns/username/:username')
    async getCampaignByUsername(@Param('username') username: string) {
        return this.tabletopService.getCampaignDataByUsername(username);
    }

    @Public()
    @Get('questions/:id')
    async getQuestionsById(@Param('id') id: string) {
        return this.tabletopService.getQuestionDataByCampaignId(id);
    }

    @Public()
    @Get('questions/name/:name')
    async getQuestionDataByCampaignName(@Param('name') name: string) {
        return this.tabletopService.getQuestionDataByCampaignName(name);
    }

    /*your TabletopService is extended to handle updates
    to the isRunning field,
     and your controller can process requests from the 
     frontend to update this value.*/
    @Public()
    @Patch(':id/isRunning')
    async updateIsRunning(
        @Param('id') id: string,
        @Body('isRunning') isRunning: boolean,
    ) {
        return this.tabletopService.updateIsRunning(id, isRunning);
    }

    /*
    This route searches a campaign by its campaign ID and once it's found, it returns a boolean
    which tells if the campaign is running or not.
     */
    @Public()
    @Get('campaign-state')
    async getCampaignState(@Query('id') id: string, @Res() res: Response) {
        const campaignStatus = await this.tabletopService.getCampaignStatus(id);
        if (campaignStatus === 404) {
            res.status(HttpStatus.NOT_FOUND);
            res.send({
                campaignStatus: false
            })
        } else {
            res.status(HttpStatus.OK)
            res.send({
                campaignStatus: campaignStatus
            })
        }
    }

    // Add the question number with campaign ID
    @Post('add-question-number')
    async addQuestionNumber(@Body() req: QuestionNumberDto, @Res() res: Response) {
        const result = await this.tabletopService.addQuestionNumber(req);
        if (result.message === 'ok') {
            res.status(HttpStatus.CREATED).send();

        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        }
    }

    @Patch('update-question-number/:id')
    async updateQuestionNumber(@Param() campaignId: { id: string }, @Res() res: Response) {
        const result = await this.tabletopService.updateQuestionNumber(campaignId.id);
        if (result.message === 'ok') {
            res.status(HttpStatus.ACCEPTED).send();
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        }
    }

    @Public()
    @Get('get-question-number/:id')
    async getQuestionNumber(@Param('id') id: string) {
        const result = await this.tabletopService.fetchQuestionNumber(id);
        console.log(result)
        return result.questionNumber;
    }

    @Delete('delete-question-number/:id')
    async deleteQuestionNumber(@Param('id') id: string): Promise<any> {
        return this.tabletopService.deleteQuestionNumber(id);
    }

    @Patch('update-completion-status/:id')
    async updateCompletionStatus(@Param('id') id: string, @Res() res: Response) {
        const response = await this.tabletopService.updateTabletopCompletionStatus(id, true);
        if (response === null) {
            res.status(HttpStatus.NOT_FOUND).send();
        } else {
            res.status(HttpStatus.OK).send();
        }
    }

    @Get('campaign-completion-status/:id')
    async campaignCompletionStatus(@Param('id') id: string, @Res() res: Response) {
        const response = await this.tabletopService.fetchCampaignCompletionStatus(id);
        if (response === null) {
            res.status(HttpStatus.NOT_FOUND).send();
        } else {
            res.status(HttpStatus.OK).send({
                campaignCompletionStatus: response
            });
        }
    }
}

