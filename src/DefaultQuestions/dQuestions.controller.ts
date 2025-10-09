import { Controller, Get, Post} from "@nestjs/common";
import { dQuestionsService } from "./dQuestions.service";
import { QuestionSchema } from "../database/schemas/question.schema";
import { dQuestionsdto } from "./dQuestions.dto";

@Controller('questions')
export class dQuestionsController{
    constructor(private readonly dQuestionService: dQuestionsService){}

    @Get('fetch-default-questions')
    async fetchDefaultQuestions(){
        return this.dQuestionService.getAllQuestions();
    }

}