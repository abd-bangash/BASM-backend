import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';


//superuser
export type SuperUserDocument = HydratedDocument<SuperUser>;

@Schema({ collection: 'SuperCollections' })
export class SuperUser {
  @Prop({ required: true, unique: true })
  username: string;
 
  @Prop({ required: true})
  name: string;

  @Prop({ required: true, unique: true })
  email: string; 

  @Prop({ required: true })
  password: string;  // Store the hashed password

  @Prop()
  hashedRT: string; // The hashed refresh token
}

export const SuperUserSchema = SchemaFactory.createForClass(SuperUser);