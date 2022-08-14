import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeController } from './coffees.controller';

describe('CoffeesController', () => {
  let controller: CoffeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoffeeController],
    }).compile();

    controller = module.get<CoffeeController>(CoffeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
