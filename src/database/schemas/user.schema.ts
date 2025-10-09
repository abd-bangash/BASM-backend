import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'ClientsCollection' }) // 👈 collection explicitly 'clients'
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string; // This will store the hashed password


  @Prop({ required: true })
  phone: number;

  @Prop({ default: new Date() })
  dateAdded: Date;

  @Prop()
  twoFactorAuthenticationSecret?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
