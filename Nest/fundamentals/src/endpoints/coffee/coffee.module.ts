import { Module } from '@nestjs/common';
import { CoffeeService } from './coffee.service';
import { CoffeeController } from './coffees.controller';

@Module({
  imports: [],
  controllers: [CoffeeController],
  providers: [CoffeeService],
  exports: [CoffeeService],
})
export class CoffeeModule {}
