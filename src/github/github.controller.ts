import { Controller, Get, Query } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {

  constructor(private githubService: GithubService) {}

  @Get()
  async getReleases(@Query('tech') tech: string) {
    return this.githubService.getReleases(tech);
  }
}