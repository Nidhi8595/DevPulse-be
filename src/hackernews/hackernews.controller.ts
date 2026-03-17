import { Controller,Get, Query } from '@nestjs/common';
import { HackernewsService } from './hackernews.service';

@Controller('hackernews')
export class HackernewsController {
    constructor(private hackernewsService: HackernewsService){}

    @Get()
    async getPosts(@Query('tech') tech:string){
        return this.hackernewsService.getPosts(tech);
    }

}
