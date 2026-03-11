import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { NewsModule } from 'src/news/news.module';
import { GithubModule } from 'src/github/github.module';
import { RedditModule } from 'src/reddit/reddit.module';

@Module({
  imports:[NewsModule, GithubModule, RedditModule],
  controllers: [FeedController],
  providers: [FeedService]
})
export class FeedModule {}
