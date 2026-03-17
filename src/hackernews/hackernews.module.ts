import { Module } from '@nestjs/common';
import { HackernewsController } from './hackernews.controller';
import { HackernewsService } from './hackernews.service';

@Module({
  controllers: [HackernewsController],
  providers: [HackernewsService],
  exports: [HackernewsService]
})
export class HackernewsModule {}
