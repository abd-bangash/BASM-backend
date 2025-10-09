import { Test, TestingModule } from '@nestjs/testing';
import { DashboardlogicsService } from './dashboardlogics.service';

describe('DashboardlogicsService', () => {
  let service: DashboardlogicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardlogicsService],
    }).compile();

    service = module.get<DashboardlogicsService>(DashboardlogicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
