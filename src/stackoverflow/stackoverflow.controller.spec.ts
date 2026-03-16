import { Test, TestingModule } from '@nestjs/testing';
import { StackoverflowController } from './stackoverflow.controller';

describe('StackoverflowController', () => {
  let controller: StackoverflowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StackoverflowController],
    }).compile();

    controller = module.get<StackoverflowController>(StackoverflowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
