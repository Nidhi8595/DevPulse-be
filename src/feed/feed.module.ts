import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { NewsModule } from 'src/news/news.module';
import { GithubModule } from 'src/github/github.module';
import { RedditModule } from 'src/reddit/reddit.module';
import { StackoverflowModule } from 'src/stackoverflow/stackoverflow.module';
import { HackernewsModule } from 'src/hackernews/hackernews.module';
import { DevtoModule } from 'src/devto/devto.module';
import { GithubTrendingModule } from '../github-trending/github-trending.module';
import { NpmModule } from '../npm/npm.module';
@Module({
  imports:[NewsModule, GithubModule, RedditModule, StackoverflowModule, HackernewsModule, DevtoModule, GithubTrendingModule, NpmModule],
  controllers: [FeedController],
  providers: [FeedService]
})
export class FeedModule {}
