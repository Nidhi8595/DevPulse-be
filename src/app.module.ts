import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NewsModule } from './news/news.module';
import { GithubModule } from './github/github.module';
import { RedditModule } from './reddit/reddit.module';
import { FeedModule } from './feed/feed.module';

import { TechModule } from './tech/tech.module';
import { StackoverflowModule } from './stackoverflow/stackoverflow.module';
import { HackernewsModule } from './hackernews/hackernews.module';
import { DevtoModule } from './devto/devto.module';
import { GithubTrendingModule } from './github-trending/github-trending.module';
import { NpmModule } from './npm/npm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NewsModule,
    GithubModule,
    RedditModule,
    FeedModule,
    TechModule,
    StackoverflowModule,
    HackernewsModule,
    DevtoModule,
    GithubTrendingModule,
    NpmModule
  ],
})
export class AppModule {}