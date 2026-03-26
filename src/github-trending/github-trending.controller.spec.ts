import { Test, TestingModule } from '@nestjs/testing';
import { GithubTrendingController } from './github-trending.controller';

describe('GithubTrendingController', () => {
  let controller: GithubTrendingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GithubTrendingController],
    }).compile();

    controller = module.get<GithubTrendingController>(GithubTrendingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
