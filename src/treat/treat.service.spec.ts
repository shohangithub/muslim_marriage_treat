import { Test, TestingModule } from '@nestjs/testing';
import { TreatService } from './treat.service';

describe('TreatService', () => {
  let service: TreatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TreatService],
    }).compile();

    service = module.get<TreatService>(TreatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
