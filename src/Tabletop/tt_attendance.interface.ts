import { Types } from 'mongoose';

export interface tt_attendance_Interface {
    first_name: string;
    last_name: string;
    designation: string;
    dateAdded: Date;
    email: string;
    campaignId: Types.ObjectId;
}

