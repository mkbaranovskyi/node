import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { PaginationDto } from "src/shared/dto";
import { CoffeeService } from './coffee.service';
import { CreateCoffeeDto, UpdateCoffeeDto } from './dto';

@Controller('coffee')
export class CoffeeController {
  constructor(private readonly coffeeService: CoffeeService) { }

  @Get()
  async findMany(@Query() paginationInput: PaginationDto) {
    const result = await this.coffeeService.findMany(paginationInput);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.coffeeService.findOne(id);
    return result;
  }

  @Post()
  async create(@Body(ValidationPipe) dto: CreateCoffeeDto) {
    const result = await this.coffeeService.create(dto);
    return result;
  }

  @Patch(':id')
  async update(@Param('id', ValidationPipe) id: number, @Body() dto: UpdateCoffeeDto) {
    const result = await this.coffeeService.update(id, dto);
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const result = await this.coffeeService.remove(id);
    return result;
  }

  @Patch(':id/recommend')
  async recommend(@Param('id') id: number) {
    const result = await this.coffeeService.recommendCoffee(id);
    return result;
  }
}
