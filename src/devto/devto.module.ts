import { Module } from '@nestjs/common';
import { DevtoController } from './devto.controller';
import { DevtoService } from './devto.service';

@Module({
  controllers: [DevtoController],
  providers: [DevtoService],
  exports: [DevtoService]
})
export class DevtoModule {}
