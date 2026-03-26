import { Module } from '@nestjs/common';
import { GithubTrendingService } from './github-trending.service';
import { GithubTrendingController } from './github-trending.controller';

@Module({
    controllers:[GithubTrendingController],
    providers: [GithubTrendingService],
    exports: [GithubTrendingService],
})
export class GithubTrendingModule { }
