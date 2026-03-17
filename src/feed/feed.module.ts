import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { NewsModule } from 'src/news/news.module';
import { GithubModule } from 'src/github/github.module';
import { RedditModule } from 'src/reddit/reddit.module';
import { StackoverflowModule } from 'src/stackoverflow/stackoverflow.module';
import { HackernewsModule } from 'src/hackernews/hackernews.module';
import { DevtoModule } from 'src/devto/devto.module';
@Module({
  imports:[NewsModule, GithubModule, RedditModule, StackoverflowModule, HackernewsModule, DevtoModule],
  controllers: [FeedController],
  providers: [FeedService]
})
export class FeedModule {}
