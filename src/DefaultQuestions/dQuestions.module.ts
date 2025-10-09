import { Injectable, Module } from "@nestjs/common";
import { dQuestionsService } from "./dQuestions.service";
import { dQuestionsController } from "./dQuestions.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { QuestionSchema } from "../database/schemas/question.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{name: "DefaultQuestions", schema: QuestionSchema}])
    ],
    controllers: [dQuestionsController],
    providers: [dQuestionsService],
    exports: [dQuestionsService]
})
export class DefaultQuestionsModule{}