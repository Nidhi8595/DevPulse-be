import { Test, TestingModule } from '@nestjs/testing';
import { DevtoController } from './devto.controller';

describe('DevtoController', () => {
  let controller: DevtoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevtoController],
    }).compile();

    controller = module.get<DevtoController>(DevtoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
