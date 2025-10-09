import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/database/schemas/user.schema';
import { CreateUserDto } from 'src/database/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  
    async create(userData: CreateUserDto): Promise<User> {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({
        $or: [
          { email: userData.email },
          { username: userData.username }
        ]
      });

      if (existingUser) {
        throw new ConflictException('User with this email or username already exists');
      }

      const saltRounds = 10;

      // hash the password before saving
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const createdUser = new this.userModel({
        ...userData,
        password: hashedPassword,
        dateAdded: new Date(),
      });

      return createdUser.save();
    }
}
  



