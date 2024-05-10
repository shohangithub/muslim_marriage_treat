import { Test, TestingModule } from '@nestjs/testing';
import { TreatController } from './treat.controller';
import { TreatService } from './treat.service';

describe('TreatController', () => {
  let controller: TreatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreatController],
      providers: [TreatService],
    }).compile();

    controller = module.get<TreatController>(TreatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
