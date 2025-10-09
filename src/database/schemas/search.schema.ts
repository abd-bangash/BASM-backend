import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Search {
  @Prop({ required: true })
  keyword: string;

  @Prop()
  source: string;

  @Prop({default:0})
  resultLength : number;
}

export type SearchDocument = Search & Document;
export const SearchSchema = SchemaFactory.createForClass(Search);
