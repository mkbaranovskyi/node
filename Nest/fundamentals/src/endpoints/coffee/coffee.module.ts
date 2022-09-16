import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "src/shared/events/entities";
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import { Coffee, Flavor } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([
    Coffee,
    Event,
    Flavor,
  ])],
  controllers: [CoffeeController],
  providers: [CoffeeService],
  exports: [CoffeeService],
})
export class CoffeeModule { }
