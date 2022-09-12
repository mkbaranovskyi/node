import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoffeeService } from './coffee.service';
import { CoffeeController } from './coffees.controller';
import { CoffeeEntity } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([
    CoffeeEntity,
  ])],
  controllers: [CoffeeController],
  providers: [CoffeeService],
  exports: [CoffeeService],
})
export class CoffeeModule { }
