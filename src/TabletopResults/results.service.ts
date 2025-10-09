import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Schema, Types } from 'mongoose';
import { TabletopResults, TabletopResultsDocument } from '../database/schemas/results.schema';
import { Tabletop } from "../database/schemas/tabletop.schema";
import { TabletopService } from "../Tabletop/tabletop.service";
import { TabletopQuestion } from "../database/schemas/question.schema";
import { questions } from "../Tabletop/question.interface";
import { dQuestionsService } from "../DefaultQuestions/dQuestions.service";
import { TabletopAttendance, tt_attendance_Document } from '../database/schemas/tabletop_attendance.schema';


interface Answer {
    campaignId: string;
    userId: string;
    questionNumber: string;
    category: string;
    userAnswer: string[];
    correctAnswer: string[];
}
//data that will get stored in the database
interface ReturnData {
    campaignId: mongoose.Types.ObjectId;
    userId: string;
    totalMarks: number;
    obtainedMarks: number;
    categoryScore: Schema.Types.Mixed;
}

@Injectable()
export class ResultsService {
    private currentCampaignData: Tabletop;
    constructor(
        @InjectModel(TabletopResults.name) private tabletopResultsModel: Model<TabletopResultsDocument>,
        @InjectModel(TabletopAttendance.name) private attendanceModel: Model<tt_attendance_Document>,
        private tabletopService: TabletopService,
        private readonly questionsService: dQuestionsService
    ) { }

    private getTotalTabletopCampaignQuestions(questionsList: questions[]): number {
        let total_questions = 0;
        questionsList.forEach((question) => {
            total_questions += question.questions.length;
        })
        return total_questions;
    }

    private getQuestionsInAList(campaignData: Tabletop) {
        let campaignQuestions: TabletopQuestion[] = [];
        campaignData.questions.forEach((question) => {
            question.questions.forEach((singleQuestion) => {
                singleQuestion['category'] = question.category;
                campaignQuestions.push(singleQuestion);
            })
        });
        return campaignQuestions;
    }

    async saveResultsHussain(results: Answer[]): Promise<ReturnData> {
        this.currentCampaignData = await this.tabletopService.getCampaignDataById(results[0].campaignId);
        const userScore = this.calculateUserScore(results);
        const totalScore = this.getTotalTabletopCampaignQuestions(this.currentCampaignData.questions) * 10;
        const categoryScores = await this.calculateCategoryScores(results);
        const newResults = new this.tabletopResultsModel({
            campaignId: new mongoose.Types.ObjectId(results[0].campaignId),
            userId: results[0].userId,
            totalMarks: totalScore,
            obtainedMarks: userScore,
            categoryScore: categoryScores,

        });

        return newResults.save();
    }

    private async calculateCategoryScores(answers: Answer[]): Promise<{ [category: string]: { obtainedMarks: number, totalMarks: number } }> {
        const categoryScores: { [category: string]: { obtainedMarks: number, totalMarks: number } } = {};
        const campaignData = await this.tabletopService.getCampaignDataById(answers[0].campaignId);
        const campaignQuestions = this.getQuestionsInAList(campaignData);

        // Precalculate the categoryScores
        campaignData.questions.forEach((question) => {
            categoryScores[question.category] = { obtainedMarks: 0, totalMarks: question.questions.length * 10 };
        })

        for (let i = 0; i < answers.length; i++) {
            const category = answers[i].category;

            // Check if the answers are correct and the question number is same
            let isCorrect = false;
            for (let j = 0; j < campaignQuestions.length; j++) {
                if (campaignQuestions[j].number === answers[i].questionNumber) {
                    isCorrect = JSON.stringify(answers[i].userAnswer.sort()) === JSON.stringify(answers[i].correctAnswer.sort());
                    break;
                }
            }

            if (isCorrect) {
                categoryScores[category].obtainedMarks += 10;
            }
        }

        return categoryScores;
    }

    private calculateUserScore(results: { userAnswer: string[]; correctAnswer: string[] }[]): number {
        let userScore = 0;
        for (let i = 0; i < results.length; i++) {
            if (results[i].userAnswer.sort().toString() === results[i].correctAnswer.sort().toString()) {
                userScore++;
            }
        }

        return userScore * 10;
    }

    async analyzeResultsByCampaign(campaignId: string): Promise<{
        uniqueUsers: number,
        averageScore: number,
        categoryWisePerformance: any,
        performanceDistribution: any,
        categoryWeightage: any,
        userComparison: any
    }> {
        const results: ReturnData[] = await this.tabletopResultsModel.find({ campaignId: new mongoose.Types.ObjectId(campaignId) });

        if (!results || results.length === 0) {
            throw new Error("No results found for the given campaign");
        }

        const uniqueUsers = new Set(results.map(result => result.userId)).size;

        const totalMarks = results.reduce((sum, res) => sum + res.totalMarks, 0);
        const totalObtainedMarks = results.reduce((sum, res) => sum + res.obtainedMarks, 0);
        const averageScore = (totalObtainedMarks / totalMarks) * 100;

        const categoryWisePerformance = this.calculateCategoryPerformance(results);

        const performanceDistribution = this.calculatePerformanceDistribution(results);

        const categoryWeightage = this.calculateCategoryWeightage(results);

        const userComparison = this.calculateUserComparison(results);

        return {
            uniqueUsers,
            averageScore,
            categoryWisePerformance,
            performanceDistribution,
            categoryWeightage,
            userComparison
        };
    }

    private calculateCategoryPerformance(results: TabletopResults[]): { [category: string]: { obtainedMarks: number, totalMarks: number } } {
        const categoryScores: { [category: string]: { obtainedMarks: number, totalMarks: number } } = {};

        results.forEach(result => {
            const categories = Object.keys(result.categoryScore);
            categories.forEach(category => {
                if (!categoryScores[category]) {
                    categoryScores[category] = { obtainedMarks: 0, totalMarks: 0 };
                }
                categoryScores[category].obtainedMarks += result.categoryScore[category].obtainedMarks;
                categoryScores[category].totalMarks += result.categoryScore[category].totalMarks;
            });
        });

        return categoryScores;
    }

    private calculatePerformanceDistribution(results: TabletopResults[]): { range: string, count: number }[] {
        const distribution = { "0-50%": 0, "50-75%": 0, "75-100%": 0 };

        results.forEach(result => {
            const percentage = (result.obtainedMarks / result.totalMarks) * 100;

            if (percentage <= 50) {
                distribution["0-50%"]++;
            } else if (percentage <= 75) {
                distribution["50-75%"]++;
            } else {
                distribution["75-100%"]++;
            }
        });

        return Object.keys(distribution).map(key => ({
            range: key,
            count: distribution[key]
        }));
    }

    private calculateCategoryWeightage(results: ReturnData[]): { [category: string]: number } {
        const categoryWeightage: { [category: string]: number } = {};

        results.forEach(result => {
            const categories = Object.keys(result.categoryScore);
            categories.forEach(category => {
                if (!categoryWeightage[category]) {
                    categoryWeightage[category] = 0;
                }
                categoryWeightage[category] += result.categoryScore[category].totalMarks;
            });
        });

        return categoryWeightage;
    }

    private calculateUserComparison(results: ReturnData[]): { userId: string, categories: { [category: string]: number } }[] {
        const userComparison: { userId: string, categories: { [category: string]: number } }[] = [];

        results.forEach(result => {
            const userCategoryScore: { [category: string]: number } = {};
            const categories = Object.keys(result.categoryScore);

            categories.forEach(category => {
                userCategoryScore[category] = result.categoryScore[category].obtainedMarks;
            });

            userComparison.push({
                userId: result.userId,
                categories: userCategoryScore
            });
        });

        return userComparison;
    }

    async getAveragePerformance(campaignId: string): Promise<number> {
        const mongooseCampaignId = new mongoose.Types.ObjectId(campaignId);
        const results = await this.tabletopResultsModel.find({ campaignId: mongooseCampaignId });
        const totalObtainedMarks = results.reduce((sum, result) => sum + result.obtainedMarks, 0);
        const totalMarks = results.reduce((sum, result) => sum + result.totalMarks, 0);

        return (totalObtainedMarks / totalMarks) * 100;
    }

    async getCategoryWisePerformance(campaignId?: string): Promise<any> {
        let mongooseCampaignId, results;
        if (campaignId) {
            mongooseCampaignId = new mongoose.Types.ObjectId(campaignId);
            results = await this.tabletopResultsModel.find({ campaignId: mongooseCampaignId });
        } else {
            results = await this.tabletopResultsModel.find().exec();
        }

        const categoryScores = {};
        results.forEach(result => {
            const categories = result.categoryScore;
            Object.keys(categories).forEach(category => {
                if (!categoryScores[category]) {
                    categoryScores[category] = { obtainedMarks: 0, totalMarks: 0 };
                }
                categoryScores[category].obtainedMarks += categories[category].obtainedMarks;
                categoryScores[category].totalMarks += categories[category].totalMarks;
            });
        });

        Object.keys(categoryScores).forEach(category => {
            categoryScores[category].percentage =
                (categoryScores[category].obtainedMarks / categoryScores[category].totalMarks) * 100;
        });

        Object.keys(categoryScores).forEach(category => {
            const newCategory = category[0].toUpperCase() + category.replaceAll('_', ' ').slice(1)
            categoryScores[newCategory] = categoryScores[category].percentage;
            delete categoryScores[category];
            delete categoryScores[newCategory].obtainedMarks;
            delete categoryScores[newCategory].totalMarks;
        })
        return categoryScores;
    }

    async getPerformanceDistribution(campaignId?: string): Promise<any> {
        let mongooseCampaignId, results;
        if (campaignId) {
            mongooseCampaignId = new mongoose.Types.ObjectId(campaignId);
            results = await this.tabletopResultsModel.find({ campaignId: mongooseCampaignId });
        } else {
            results = await this.tabletopResultsModel.find().exec();
        }
        const distribution = { "0-50%": 0, "51-75%": 0, "76-100%": 0 };

        results.forEach(result => {
            const percentage = (result.obtainedMarks / result.totalMarks) * 100;
            if (percentage <= 50) {
                distribution["0-50%"]++;
            } else if (percentage <= 75) {
                distribution["51-75%"]++;
            } else {
                distribution["76-100%"]++;
            }
        });

        return distribution;
    }

    async getOverallPerformanceComparison(campaignId: string): Promise<any> {
        const mongooseCampaignId = new mongoose.Types.ObjectId(campaignId);
        const results = await this.tabletopResultsModel.find({ campaignId: mongooseCampaignId });

        return results.map(result => ({
            userId: result.userId,
            obtainedMarks: result.obtainedMarks,
            totalMarks: result.totalMarks,
            percentage: (result.obtainedMarks / result.totalMarks) * 100,
        }));
    }

    private formatCategories(unformattedData: string[]): string[] {
        let formattedData: string[] = [];
        unformattedData.forEach((val) => {
            formattedData.push(val[0].toUpperCase() + val.replaceAll('_', ' ').slice(1));
        });
        return formattedData;
    }

    async getCategoryWisePerformanceRadarChart(): Promise<any> {
        const results = await this.tabletopResultsModel.find().exec();
        const tabletopCategories = await this.questionsService.getAllQuestions();
        let questionCategories: string[] = [];
        tabletopCategories.forEach((question) => {
            questionCategories.push(question.category);
        })
        questionCategories = this.formatCategories(questionCategories);
        console.log(questionCategories);

        const categoryScoresRadarChart = {};
        results.forEach(result => {
            const categories = result.categoryScore;
            Object.keys(categories).forEach(category => {
                if (!categoryScoresRadarChart[category]) {
                    categoryScoresRadarChart[category] = { obtainedMarks: 0, totalMarks: 0 };
                }
                categoryScoresRadarChart[category].obtainedMarks += categories[category].obtainedMarks;
                categoryScoresRadarChart[category].totalMarks += categories[category].totalMarks;
            });
        });

        Object.keys(categoryScoresRadarChart).forEach(category => {
            categoryScoresRadarChart[category].percentage =
                (categoryScoresRadarChart[category].obtainedMarks / categoryScoresRadarChart[category].totalMarks) * 100;
        });

        Object.keys(categoryScoresRadarChart).forEach(category => {
            const oldKey = category;
            const newKey = category[0].toUpperCase() + category.replaceAll('_', ' ').slice(1);
            categoryScoresRadarChart[newKey] = categoryScoresRadarChart[oldKey];
            delete categoryScoresRadarChart[oldKey];
        })

        questionCategories.forEach(category => {
            if (!(category in categoryScoresRadarChart)) {
                categoryScoresRadarChart[category] = {
                    obtainedMarks: 0,
                    totalMarks: 0,
                    percentage: 0,
                }
            }
        })

        return categoryScoresRadarChart;
    }

    async getTabletopMarksObtainedDoughnutChart(campaignId: string) {
        let mongooseId: mongoose.Types.ObjectId;
        try {
            mongooseId = new mongoose.Types.ObjectId(campaignId);
            const campaign_data = await this.tabletopResultsModel
                .find({ campaignId: mongooseId }).exec();
            if (campaign_data.length === 0) {
                return null;
            }
            const results_found_length = campaign_data.length;
            console.log(`Results found" ${results_found_length}`);
            let totalMarks = 0;
            let obtainedMarks = 0;
            for (let data of campaign_data) {
                obtainedMarks += data.obtainedMarks;
                totalMarks += data.totalMarks;
            }
            console.log(`Obtained Marks: ${obtainedMarks}`);
            return {
                obtainedMarksPercentage: (obtainedMarks / totalMarks) * 100,
                remainingMarksPercentage: 100 - ((obtainedMarks / totalMarks) * 100),
            }

        }
        catch (e) {
            console.log("Error generating data for doughnut chart.")
            console.error(e);
        }
    }

    async getResultsWithGrades(campaignId: string) {
        const mongooseId = new mongoose.Types.ObjectId(campaignId);

        const results = await this.tabletopResultsModel.find({ campaignId: mongooseId }).exec();

        if (!results || results.length === 0) {
            throw new NotFoundException('No results found for the specified campaign');
        }

        const totalObtainedMarks = results.reduce((acc, result) => acc + result.obtainedMarks, 0);
        const totalPossibleMarks = results.reduce((acc, result) => acc + result.totalMarks, 0);

        const overallPercentage = (totalObtainedMarks / totalPossibleMarks) * 100;

        const grade = this.assignGrade(overallPercentage);

        return {
            totalObtainedMarks,
            totalPossibleMarks,
            overallPercentage,
            grade,
        };
    }

    private assignGrade(percentage: number): string {
        if (percentage >= 90) return 'A';
        if (percentage >= 75) return 'B';
        if (percentage >= 60) return 'C';
        return 'F';
    }

    async getResultsByParticipant(campaignId: string) {
        return this.tabletopResultsModel.aggregate([
            // Step 1: Only include this campaign
            {
                $match: {
                    campaignId: new mongoose.Types.ObjectId(campaignId),
                },
            },

            // Step 2: Convert categoryScore object into array
            {
                $addFields: {
                    categoryArray: {
                        $objectToArray: "$categoryScore",
                    },
                },
            },

            // Step 3: Group by userId and combine all categories
            {
                $group: {
                    _id: "$userId",
                    totalObtainedMarks: { $sum: "$obtainedMarks" },
                    totalMarks: { $sum: "$totalMarks" },
                    categories: { $push: "$categoryArray" },
                },
            },

            // Step 4: Flatten nested category arrays
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    totalObtainedMarks: 1,
                    totalMarks: 1,
                    categories: {
                        $reduce: {
                            input: "$categories",
                            initialValue: [],
                            in: { $concatArrays: ["$$value", "$$this"] },
                        },
                    },
                },
            },

            // Step 5: Optionally reshape categories into a cleaner structure
            {
                $addFields: {
                    categories: {
                        $map: {
                            input: "$categories",
                            as: "cat",
                            in: {
                                categoryName: "$$cat.k",
                                obtainedMarks: "$$cat.v.obtainedMarks",
                                totalMarks: "$$cat.v.totalMarks",
                            },
                        },
                    },
                },
            },
        ]);
    }


}