import { Controller, Get, Query } from '@nestjs/common';
import { RedditService } from './reddit.service';

@Controller('reddit')
export class RedditController {

  constructor(private redditService: RedditService) {}

  @Get()
  async getPosts(@Query('tech') tech: string) {
    return this.redditService.getRedditPosts(tech);
  }

}