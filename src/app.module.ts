import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NewsModule } from './news/news.module';
import { GithubModule } from './github/github.module';
import { RedditModule } from './reddit/reddit.module';
import { FeedModule } from './feed/feed.module';

import { TechModule } from './tech/tech.module';
import { StackoverflowModule } from './stackoverflow/stackoverflow.module';

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
    StackoverflowModule
  ],
})
export class AppModule {}