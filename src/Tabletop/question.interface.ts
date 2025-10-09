import { Document } from 'mongoose';
import {TabletopQuestion} from "../database/schemas/question.schema";

export interface questions extends Document {
  readonly category: string;
  readonly questions: TabletopQuestion[];
}
