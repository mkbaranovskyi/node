import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { AuthGUard } from 'src/shared/guards';
import { TransformInterceptor } from "src/shared/interceptors";
import { ValidationPipe } from 'src/shared/pipes/custom-validation.pipe';
import { CoffeeService } from './coffee.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffee')
@UsePipes(ValidationPipe)
@UseInterceptors(TransformInterceptor)
@UseGuards(AuthGUard)
export class CoffeeController {
  constructor(private readonly coffeeService: CoffeeService) { }

  @Get()
  async findMany(@Query() paginationInput) {
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
}
