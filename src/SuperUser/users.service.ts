import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { SuperUser } from 'src/database/schemas/super_user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel('SuperCollections') private superuserModel: Model<SuperUser>){}

    /*
        This function creates the superuser. It takes username, email, plain password. It generates
        the bcrypt hash and then saves it into the 'SuperCollection' document in Mongodb
     */
    async createSuperUser(username: string, name: string, email: string, plainPassword: string) {
        const saltedRounds = 12;
        const hashedPassword = await bcrypt.hash(plainPassword, saltedRounds);

        const newUser = new this.superuserModel({
            username,
            name,
            email,
            password: hashedPassword
        })
        
        return newUser.save();
    }

    // Run a query against our mongodb collection and find user based on email.
    async findByEmail(email: string): Promise<SuperUser | null>{
        return this.superuserModel.findOne({email}).lean().exec();
    }

    async updateSuperUserRt(id: string, data: string) {
        let mongoose_id: mongoose.Types.ObjectId;
        try {
            mongoose_id = new mongoose.Types.ObjectId(id);
            return this.superuserModel.findByIdAndUpdate(mongoose_id, {hashedRT: data});
        }
        catch (e) {
            console.log("Error updating refresh token of user ", id);
            console.error(e);
        }
    }

    async updateSuperUserByUsername(username: string, data: any) {
        return this.superuserModel.updateOne({username}, data).exec();
    }

    async findByUserId(id: string){
        let mongooseId: mongoose.Types.ObjectId;
        try {
            mongooseId = new mongoose.Types.ObjectId(id);
            return this.superuserModel.findOne({_id: mongooseId}).exec();
        }
        catch (e) {
            console.log("An error has occurred: ");
            console.error(e);
            return null;
        }
    }

    async findSuperUserByUsername(username: string) {
        return this.superuserModel.findOne({username}).exec();
    }

    async getSuperUserPasswordByUsername(username: string) {
        const user = await this.superuserModel.findOne({username}).exec();
        if (!user) return null;
        return user.password;
    }

    async deleteSuperUserRt(userId: string) {
        let mongooseId : mongoose.Types.ObjectId;
        try {
            mongooseId = new mongoose.Types.ObjectId(userId);
            return this.superuserModel.findByIdAndUpdate(mongooseId, {hashedRT: null});
        }
        catch (e) {
            console.log("An error has occurred: ");
            console.error(e);
            return null;
        }
    }
}
