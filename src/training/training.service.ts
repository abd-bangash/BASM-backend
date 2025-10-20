import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TabletopAttendance, tt_attendance_Document } from '../database/schemas/tabletop_attendance.schema';
import { CategoryVideo, CategoryVideoDocument } from '../database/schemas/category_video_schema';

@Injectable()
export class TrainingService {
  constructor(
    @InjectModel(TabletopAttendance.name) private attendanceModel: Model<tt_attendance_Document>,
    @InjectModel(CategoryVideo.name) private categoryVideoModel: Model<CategoryVideoDocument>,
  ) {}

  async getTrainingSession(userId: string, campaignId: string): Promise<any> {
    const attendance = await this.attendanceModel.findOne({ _id: userId, campaignId: campaignId }).lean().exec();

    if (!attendance || !attendance.weakCategories || attendance.weakCategories.length === 0) {
      throw new NotFoundException('No weak categories found for this user in this campaign.');
    }

    const trainingData = [];

    for (const categoryName of attendance.weakCategories) {
      const video = await this.categoryVideoModel.findOne({ categoryName }).lean().exec();

      if (video) {
        trainingData.push({
          categoryName: video.categoryName,
          videoUrl: `http://localhost:3000/videos/${video.filePath}`,
          interactiveQuestions: video.interactiveQuestions,
        });
      }
    }

    return trainingData;
  }
}
