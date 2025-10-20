import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TabletopAttendance, tt_attendance_Document } from '../database/schemas/tabletop_attendance.schema';
import { CategoryVideo, CategoryVideoDocument } from '../database/schemas/category_video_schema';
import { dQuestionsService } from '../DefaultQuestions/dQuestions.service';
import { TabletopQuestion } from '../database/schemas/question.schema';
import { EmailService } from '../services/email.service';

interface AssessmentAnswer {
  questionNumber: string;
  userAnswer: string[];
}

@Injectable()
export class TrainingService {
  constructor(
    @InjectModel(TabletopAttendance.name) private attendanceModel: Model<tt_attendance_Document>,
    @InjectModel(CategoryVideo.name) private categoryVideoModel: Model<CategoryVideoDocument>,
    private readonly dquestionsService: dQuestionsService,
    private readonly emailService: EmailService,
  ) { }

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

  async submitAssessment(userId: string, campaignId: string, answers: AssessmentAnswer[]): Promise<any> {
    const attendance = await this.attendanceModel.findOne({ _id: userId, campaignId: campaignId }).lean().exec();
    if (!attendance || !attendance.weakCategories || attendance.weakCategories.length === 0) {
      throw new NotFoundException('No active training session found for this user.');
    }

    const categoryScores: { [category: string]: { obtained: number; total: number } } = {};
    attendance.weakCategories.forEach(cat => {
      categoryScores[cat] = { obtained: 0, total: 0 };
    });

    let questionsForAssessment: TabletopQuestion[] = [];
    for (const category of attendance.weakCategories) {
      const questions = await this.dquestionsService.getQuestionsByCategory(category);
      questionsForAssessment.push(...questions);
    }

    for (const question of questionsForAssessment) {
      categoryScores[question.category].total += 10;
      const userAnswer = answers.find(a => a.questionNumber === question.number);
      if (userAnswer) {
        const isCorrect = JSON.stringify(userAnswer.userAnswer.sort()) === JSON.stringify(question.correctAnswer.sort());
        if (isCorrect) {
          categoryScores[question.category].obtained += 10;
        }
      }
    }

    const passedCategories = [];
    Object.keys(categoryScores).forEach(category => {
      const score = categoryScores[category];
      const percentage = score.total > 0 ? (score.obtained / score.total) * 100 : 100;
      if (percentage >= 80) {
        passedCategories.push(category);
      }
    });

    if (passedCategories.length > 0) {
      await this.attendanceModel.updateOne(
        { _id: userId, campaignId: campaignId },
        { $pull: { weakCategories: { $in: passedCategories } } },
      );
    }

    const remainingCategories = attendance.weakCategories.filter(cat => !passedCategories.includes(cat));

    if (remainingCategories.length === 0) {
      // All categories have been passed
      await this.emailService.sendTrainingCompletionEmail(attendance.email, attendance.first_name);
      return { success: true, message: 'Congratulations! You have completed all training modules.' };
    }

    return {
      success: false,
      message: 'Please continue to review the materials for your remaining weak categories.',
      passed: passedCategories,
      failed: remainingCategories,
    };
  }
}
