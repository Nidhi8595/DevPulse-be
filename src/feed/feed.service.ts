import { Injectable } from '@nestjs/common';
import { NewsService } from '../news/news.service';
import { GithubService } from '../github/github.service';
import { RedditService } from '../reddit/reddit.service';
import { StackoverflowService } from '../stackoverflow/stackoverflow.service';
import { HackernewsService } from '../hackernews/hackernews.service';
import { DevtoService } from '../devto/devto.service';
import { GithubTrendingService } from '../github-trending/github-trending.service';
import { NpmService } from '../npm/npm.service';

@Injectable()
export class FeedService {
  constructor(
    private newsService: NewsService,
    private githubService: GithubService,
    private redditService: RedditService,
    private stackoverflowService: StackoverflowService,
    private hackernewsService: HackernewsService,
    private devtoService: DevtoService,
    private githubTrendingService: GithubTrendingService,
    private npmService: NpmService,
  ) { }

  // Clean the tech name — remove js suffix, dots, extra spaces
  normalizeTech(tech: string): string {
    return tech
      .toLowerCase()
      .trim()
      // Remove trailing .js or js (nodejs → node) but NOT mid-word
      // e.g. "expressjs" → "express", "node.js" → "node"
      // but "javascript" stays "javascript"
      .replace(/^(.+?)(?:\.js)$/i, '$1')   // node.js → node
      .replace(/^(.{4,})js$/i, '$1');       // expressjs → express (only if base is 4+ chars)
  }

  async getFeed(tech: string) {
    const base = this.normalizeTech(tech);

    // Fetch all sources in parallel for speed
    const [news, github, reddit, stackoverflow, hackernews, devto, githubTrending, npm] =
      await Promise.all([
        this.newsService.getTechNews(base),
        this.githubService.getReleases(base),
        this.redditService.getRedditPosts(base),
        this.stackoverflowService.getQuestions(base),
        this.hackernewsService.getPosts(base),
        this.devtoService.getArticles(base),
        this.githubTrendingService.getTrending(base),
        this.npmService.getPackageInfo(base),
      ]);

    // Validation: a real tech stack should have signals from developer sources
    const developerSignals =
      github.length + reddit.length + stackoverflow.length +
      hackernews.length + devto.length + githubTrending.length +
      npm.length;

    if (developerSignals === 0 && news.length < 3) {
      return {
        error: `"${tech}" does not appear to be a developer technology`,
      };
    }

    return {
      news: this.dedup(news),
      github: this.dedup(github),
      reddit: this.dedup(reddit),
      stackoverflow: this.dedup(stackoverflow),
      hackernews: this.dedup(hackernews),
      devto: this.dedup(devto),
      githubTrending: this.dedup(githubTrending),
      npm: this.dedup(npm),
    };
  }

  private dedup(items: any[]): any[] {
    const seen = new Map<string, any>();
    for (const item of items) {
      if (item?.url && !seen.has(item.url)) {
        seen.set(item.url, item);
      }
    }
    return Array.from(seen.values());
  }
}