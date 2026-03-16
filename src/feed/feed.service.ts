import { Injectable } from '@nestjs/common';
import { NewsService } from '../news/news.service';
import { GithubService } from '../github/github.service';
import { RedditService } from '../reddit/reddit.service';
import { StackoverflowService } from '../stackoverflow/stackoverflow.service';

@Injectable()
export class FeedService {

  constructor(
    private newsService: NewsService,
    private githubService: GithubService,
    private redditService: RedditService,
    private stackoverflowService: StackoverflowService

  ) {}

  normalizeTech(tech: string) {
    return tech
      .toLowerCase()
      .replace(".js", "")
      .replace("js", "")
      .trim();
  }

  generateKeywords(tech: string) {

    const base = tech.toLowerCase();

    const variants = new Set([
      base,
      base + "js",
      base + ".js",
      base.replace(".js", ""),
      base + " framework",
      base + " programming",
      base + " language"
    ]);

    return Array.from(variants);
  }

  async getFeed(tech: string) {

    tech = this.normalizeTech(tech);

    const keywords = this.generateKeywords(tech);

    const newsResults: any[] = [];
    const redditResults: any[] = [];
    const githubResults: any[] = [];
    const stackoverflowResults: any[] = [];
    for (const word of keywords) {

      const [news, reddit, github, stack] = await Promise.all([
        this.newsService.getTechNews(word),
        this.redditService.getRedditPosts(word),
        this.githubService.getReleases(word),
        this.stackoverflowService.getQuestions(word)
      ]);

      newsResults.push(...news);
      redditResults.push(...reddit);
      githubResults.push(...github);
      stackoverflowResults.push(...stack);
    }

    const developerSignals =
      githubResults.length +
      redditResults.length;

    const totalResults =
      newsResults.length +
      redditResults.length +
      githubResults.length +
      stackoverflowResults.length;

    if (developerSignals === 0) {
      return {
        error: `"${tech}" does not appear to be a developer technology`
      };
    }

    if (totalResults < 3) {
      return {
        error: `"${tech}" returned too few results`
      };
    }

    return {
      news: this.removeDuplicates(newsResults),
      reddit: this.removeDuplicates(redditResults),
      github: this.removeDuplicates(githubResults),
      stackoverflow: this.removeDuplicates(stackoverflowResults)
    };
  }

  removeDuplicates(items: any[]) {

    const map = new Map();

    for (const item of items) {
      map.set(item.url, item);
    }

    return Array.from(map.values());
  }
}