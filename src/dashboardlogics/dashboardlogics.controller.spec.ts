import { Test, TestingModule } from '@nestjs/testing';
import { DashboardlogicsController } from './dashboardlogics.controller';

describe('DashboardlogicsController', () => {
  let controller: DashboardlogicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardlogicsController],
    }).compile();

    controller = module.get<DashboardlogicsController>(DashboardlogicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
