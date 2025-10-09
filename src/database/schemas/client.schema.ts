import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

/**
 * This is schema for the client document. It consists of:
 * name: string (The name of the client)
 * dateAdded: Date (The date when the client was added.)
 */
export type clientDocument = HydratedDocument<Client>;
//threat cure clients collection 
@Schema({collection: 'ClientsCollection'})
export class Client{

    @Prop({ required: true, unique: true })
    username: string

    @Prop({ required: true})
    name: string

    @Prop({ required: true})
    dateAdded: Date
    
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    monitoredDomains: string[];

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    phone: number;

    @Prop({ required: true })
    twoFactorAuthenticationSecret: string;

    @Prop()
    hashedRT: string; // The hashed refresh token
}

export const ClientSchema = SchemaFactory.createForClass(Client);