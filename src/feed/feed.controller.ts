import { Controller, Get, Query } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {

  constructor(private feedService: FeedService) {}

  @Get()
  async getFeed(@Query('tech') tech: string) {
    return this.feedService.getFeed(tech);
  }

}