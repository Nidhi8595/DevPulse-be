import { Injectable } from '@nestjs/common';
import { NewsService } from '../news/news.service';
import { GithubService } from '../github/github.service';
import { RedditService } from '../reddit/reddit.service';

@Injectable()
export class FeedService {

  constructor(
    private newsService: NewsService,
    private githubService: GithubService,
    private redditService: RedditService
  ) {}

  async getFeed(tech: string) {

    const news = await this.newsService.getTechNews(tech);
    const github = await this.githubService.getReleases(tech);
    const reddit = await this.redditService.getRedditPosts(tech);

    return {
      news,
      github,
      reddit
    };

  }

}