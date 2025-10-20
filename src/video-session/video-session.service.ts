import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { TrainingSession, TrainingSessionDocument } from '../database/schemas/training_session_schema';
import { EmailService } from '../services/email.service';

@Injectable()
export class VideoSessionsService {
    constructor(
        @InjectModel(TrainingSession.name) private sessionModel: Model<TrainingSessionDocument>,
        private readonly emailService: EmailService
    ) { }

    async createSessionForWeakCategory(user, category: string, videoPath: string) {
        const token = uuidv4();

        const session = await this.sessionModel.create({
            userId: user._id || user.id,
            email: user.email,
            category,
            videoPath,
            token
        });

        const link = `https://your-frontend.com/watch?token=${token}`;
        await this.emailService.sendVideoLink(user.email, category, link);

        return session;
    }

    async getSessionByToken(token: string) {
        return this.sessionModel.findOne({ token });
    }

    async updateProgress(token: string, progress: number) {
        return this.sessionModel.findOneAndUpdate({ token }, { progress }, { new: true });
    }

    async markCompleted(token: string) {
        return this.sessionModel.findOneAndUpdate(
            { token },
            { completed: true, completedAt: new Date() },
            { new: true }
        );
    }
}
