import { Test, TestingModule } from '@nestjs/testing';
import { NpmController } from './npm.controller';

describe('NpmController', () => {
  let controller: NpmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NpmController],
    }).compile();

    controller = module.get<NpmController>(NpmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
