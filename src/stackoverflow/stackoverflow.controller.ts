import { Controller,Get,Query } from '@nestjs/common';
import { StackoverflowService } from './stackoverflow.service';

@Controller('stackoverflow')
export class StackoverflowController {
    constructor(private stackoverflowService: StackoverflowService) {}

    @Get()
    async getQuestions(@Query('tech') tech:string){
        return this.stackoverflowService.getQuestions(tech);
    }
}
