import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGUard } from 'src/shared/guards';
import { ValidationPipe } from 'src/shared/pipes/custom-validation.pipe';
import { CoffeeService } from './coffee.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeTdo } from './dto/update-coffee.tdo';

@Controller('coffee')
@UseGuards(AuthGUard)
@UsePipes(ValidationPipe)
export class CoffeeController {
  constructor(private readonly coffeeService: CoffeeService) { }

  @Get()
  findAll(@Query() paginationInput) {
    const { limit, offset } = paginationInput;
    return `Get all. Limit: ${limit}, offset: ${offset}`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Get id: ${id}`;
  }

  @Post()
  create(@Body(ValidationPipe) createCoffeeDto: CreateCoffeeDto) {
    throw new ForbiddenException('ro');
    return createCoffeeDto;
  }

  @Patch(':id')
  update(@Param('id', ValidationPipe) id: string, @Body() updateCoffeeDto: UpdateCoffeeTdo) {
    return `Patch id: ${id}`;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return `Delete: ${id}`;
  }
}
