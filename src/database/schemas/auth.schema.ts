import {HydratedDocument} from "mongoose";
import {Schema, SchemaFactory} from "@nestjs/mongoose";
import {Prop} from "@nestjs/mongoose";


export type authDocument = HydratedDocument<Auth2FA>

@Schema({collection: 'authCollection'})
export class Auth2FA {
    @Prop({required: true})
    email: string;

    @Prop({required: true})
    code: string;

    @Prop({
        type: Date,
        default: Date.now,
        expires: 600 // Delete document after 10 minutes (600 seconds)
    })
    createdAt: Date;
}

export const Auth2FASchema = SchemaFactory.createForClass(Auth2FA);