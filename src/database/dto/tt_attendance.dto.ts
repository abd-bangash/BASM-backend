
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class tt_attendance_Dto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  designation: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  campaignId: string;

  dateAdded?: Date;
}
