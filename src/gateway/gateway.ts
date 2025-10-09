import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { Server } from 'socket.io';
import {OnModuleInit} from "@nestjs/common";

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class TabletopGateway implements OnModuleInit{
    @WebSocketServer()
    server: Server

    onModuleInit(): any {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
            console.log("Connected");
        })

        this.server.on('disconnect', (socket) => {
            console.log("Disconnected: ", socket.id);
        })
    }

    @SubscribeMessage('end_campaign')
    onEndCampaign(@MessageBody() body: any) {
        console.log("Got data: ", body);
        this.server.emit('end campaign', body);
    }

    @SubscribeMessage('next_campaign_question')
    onNextCampaignQuestion(@MessageBody() body: any) {
        console.log(`Next question for campaign: ${body}`);
        this.server.emit('next question', body);
    }
}