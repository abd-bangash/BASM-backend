import mongoose, {HydratedDocument} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";


export type TabletopSessionsDocument = HydratedDocument<TabletopSessions>;

@Schema({collection: 'tabletopSessionsCollection'})
export class TabletopSessions {
    @Prop({required: true})
    userId: string;

    @Prop({required: true})
    campaignId: string;

    @Prop({required: true})
    responseSubmitted: mongoose.Schema.Types.Mixed;
}

export const TabletopSessionsSchema = SchemaFactory.createForClass(TabletopSessions);