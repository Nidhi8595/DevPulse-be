import { Controller,Get,Query } from '@nestjs/common';
import { GithubTrendingService } from './github-trending.service';

@Controller('github-trending')
export class GithubTrendingController {
  constructor(private githubTrendingService: GithubTrendingService) {}

  @Get()
  async getTrending(@Query('tech') tech: string) {
    return this.githubTrendingService.getTrending(tech);
  }
}
