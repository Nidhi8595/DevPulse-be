import { Test, TestingModule } from '@nestjs/testing';
import { DevtoService } from './devto.service';

describe('DevtoService', () => {
  let service: DevtoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevtoService],
    }).compile();

    service = module.get<DevtoService>(DevtoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
