// import { Injectable } from '@nestjs/common';
// import { NewsService } from '../news/news.service';
// import { GithubService } from '../github/github.service';
// import { RedditService } from '../reddit/reddit.service';
// import { StackoverflowService } from '../stackoverflow/stackoverflow.service';
// import { HackernewsService } from 'src/hackernews/hackernews.service';
// import { DevtoService } from 'src/devto/devto.service';

// @Injectable()
// export class FeedService {

//   constructor(
//     private newsService: NewsService,
//     private githubService: GithubService,
//     private redditService: RedditService,
//     private stackoverflowService: StackoverflowService,
//     private hackernewsService: HackernewsService,
//     private devtoService: DevtoService

//   ) {}

//   normalizeTech(tech: string) {
//     return tech
//   //     .toLowerCase()
//   //     .replace(".js", "")
//   //     .replace("js", "")
//   //     .trim();
//   // }
//    .toLowerCase()
//       .replace(/\.js$/i, '')
//       .replace(/js$/i, '')
//       .trim();
//   }

//   // generateKeywords(tech: string) {

//   //   const base = tech.toLowerCase();

//   //   const variants = new Set([
//   //     base,
//   //     base + "js",
//   //     base + ".js",
//   //     base.replace(".js", ""),
//   //     base + " framework",
//   //     base + " programming",
//   //     base + " language"
//   //   ]);

//   //   return Array.from(variants);
//   // }
//   getGithubAliases(tech: string): string[] {
//     const aliasMap: Record<string, string[]> = {
//       node: ['nodejs/node'],
//       react: ['facebook/react'],
//       next: ['vercel/next.js'],
//       nextjs: ['vercel/next.js'],
//       tailwind: ['tailwindlabs/tailwindcss'],
//       mongodb: ['mongodb/mongo'],
//       angular: ['angular/angular'],
//       vue: ['vuejs/vue'],
//       svelte: ['sveltejs/svelte'],
//       deno: ['denoland/deno'],
//       bun: ['oven-sh/bun'],
//       nest: ['nestjs/nest'],
//       nestjs: ['nestjs/nest'],
//       express: ['expressjs/express'],
//       django: ['django/django'],
//       flask: ['pallets/flask'],
//       fastapi: ['tiangolo/fastapi'],
//       laravel: ['laravel/laravel'],
//       rails: ['rails/rails'],
//       spring: ['spring-projects/spring-boot'],
//       springboot: ['spring-projects/spring-boot'],
//       rust: ['rust-lang/rust'],
//       golang: ['golang/go'],
//       go: ['golang/go'],
//       kotlin: ['JetBrains/kotlin'],
//       swift: ['apple/swift'],
//       flutter: ['flutter/flutter'],
//       docker: ['docker/compose'],
//       kubernetes: ['kubernetes/kubernetes'],
//       graphql: ['graphql/graphql-js'],
//       redis: ['redis/redis'],
//       postgresql: ['postgres/postgres'],
//       postgres: ['postgres/postgres'],
//       mysql: ['mysql/mysql-server'],
//       prisma: ['prisma/prisma'],
//       pytorch: ['pytorch/pytorch'],
//       tensorflow: ['tensorflow/tensorflow'],
//       langchain: ['langchain-ai/langchain'],
//     };
//     return aliasMap[tech] || [];
//   }

//   // async getFeed(tech: string) {
//   //   tech = this.normalizeTech(tech);
//   //   const keywords = this.generateKeywords(tech);

//   //   const newsResults: any[] = [];
//   //   const redditResults: any[] = [];
//   //   const githubResults: any[] = [];
//   //   const stackoverflowResults: any[] = [];
//   //   const hackernewsResults: any[] = [];
//   //   const devtoResults: any[] = [];
//   //   for (const word of keywords) {

//   //     const [news, reddit, github, stack,hn,devto] = await Promise.all([
//   //       this.newsService.getTechNews(word),
//   //       this.redditService.getRedditPosts(word),
//   //       this.githubService.getReleases(word),
//   //       this.stackoverflowService.getQuestions(word),
//   //       this.hackernewsService.getPosts(word),
//   //       this.devtoService.getArticles(word)

//   //     ]);

//   //     newsResults.push(...news);
//   //     redditResults.push(...reddit);
//   //     githubResults.push(...github);
//   //     stackoverflowResults.push(...stack);
//   //     hackernewsResults.push(...hn);
//   //     devtoResults.push(...devto);
//   //   }

//   //   const developerSignals =
//   //     githubResults.length +
//   //     redditResults.length+
//   //     stackoverflowResults.length +
//   //     hackernewsResults.length +
//   //     devtoResults.length;

//   //   const totalResults =
//   //     newsResults.length +
//   //     redditResults.length +
//   //     githubResults.length +
//   //     stackoverflowResults.length+
//   //     hackernewsResults.length +
//   //     devtoResults.length;

//   //   if (developerSignals === 0) {
//   //     return {
//   //       error: `"${tech}" does not appear to be a developer technology`
//   //     };
//   //   }

//   //   if (totalResults < 3) {
//   //     return {
//   //       error: `"${tech}" returned too few results`
//   //     };
//   //   }

//   //   return {
//   //     news: this.removeDuplicates(newsResults),
//   //     reddit: this.removeDuplicates(redditResults),
//   //     github: this.removeDuplicates(githubResults),
//   //     stackoverflow: this.removeDuplicates(stackoverflowResults)
//   //     , hackernews: this.removeDuplicates(hackernewsResults),
//   //     devto: this.removeDuplicates(devtoResults)
//   //   };
//   // }
// async getFeed(tech: string) {
//     const base = this.normalizeTech(tech);

//     const [news, reddit, stackoverflow, hackernews, devto] = await Promise.all([
//       this.newsService.getTechNews(base),
//       this.redditService.getRedditPosts(base),
//       this.stackoverflowService.getQuestions(base),
//       this.hackernewsService.getPosts(base),
//       this.devtoService.getArticles(base),
//     ]);

//     const githubRepos = await this.githubService.getReleases(base);

//     const developerSignals =
//       githubRepos.length + reddit.length + stackoverflow.length + hackernews.length + devto.length;

//     if (developerSignals === 0 && news.length < 3) {
//       return { error: `"${tech}" does not appear to be a developer technology` };
//     }

//     return {
//       news: this.removeDuplicates(news),
//       github: this.removeDuplicates(githubRepos),
//       reddit: this.removeDuplicates(reddit),
//       stackoverflow: this.removeDuplicates(stackoverflow),
//       hackernews: this.removeDuplicates(hackernews),
//       devto: this.removeDuplicates(devto),
//     };
//   }
//   removeDuplicates(items: any[]) {

//     const map = new Map();

//     for (const item of items) {
//       map.set(item.url, item);
//     }

//     return Array.from(map.values());
//   }
// }


import { Injectable } from '@nestjs/common';
import { NewsService } from '../news/news.service';
import { GithubService } from '../github/github.service';
import { RedditService } from '../reddit/reddit.service';
import { StackoverflowService } from '../stackoverflow/stackoverflow.service';
import { HackernewsService } from '../hackernews/hackernews.service';
import { DevtoService } from '../devto/devto.service';

@Injectable()
export class FeedService {
  constructor(
    private newsService: NewsService,
    private githubService: GithubService,
    private redditService: RedditService,
    private stackoverflowService: StackoverflowService,
    private hackernewsService: HackernewsService,
    private devtoService: DevtoService,
  ) {}

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
    const [news, github, reddit, stackoverflow, hackernews, devto] =
      await Promise.all([
        this.newsService.getTechNews(base),
        this.githubService.getReleases(base),
        this.redditService.getRedditPosts(base),
        this.stackoverflowService.getQuestions(base),
        this.hackernewsService.getPosts(base),
        this.devtoService.getArticles(base),
      ]);

    // Validation: a real tech stack should have signals from developer sources
    const developerSignals =
      github.length + reddit.length + stackoverflow.length +
      hackernews.length + devto.length;

    if (developerSignals === 0 && news.length < 3) {
      return {
        error: `"${tech}" does not appear to be a developer technology`,
      };
    }

    return {
      news:          this.dedup(news),
      github:        this.dedup(github),
      reddit:        this.dedup(reddit),
      stackoverflow: this.dedup(stackoverflow),
      hackernews:    this.dedup(hackernews),
      devto:         this.dedup(devto),
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