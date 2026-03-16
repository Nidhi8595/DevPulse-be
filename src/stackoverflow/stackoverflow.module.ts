import { Module } from '@nestjs/common';
import { StackoverflowController } from './stackoverflow.controller';
import { StackoverflowService } from './stackoverflow.service';

@Module({
  controllers: [StackoverflowController],
  providers: [StackoverflowService],
  exports: [StackoverflowService]
})
export class StackoverflowModule {}
