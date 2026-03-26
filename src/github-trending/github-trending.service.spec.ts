import { Test, TestingModule } from '@nestjs/testing';
import { GithubTrendingService } from './github-trending.service';

describe('GithubTrendingService', () => {
  let service: GithubTrendingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GithubTrendingService],
    }).compile();

    service = module.get<GithubTrendingService>(GithubTrendingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
