import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common'
import { ProductModele } from 'src/product.modele'
import { FindProductDto } from './dto/find-product.dto'

@Controller('product')
export class ProductController {
  @Post('create')
  async create(
    @Body() dto: Omit<ProductModele, '_id'>,
  ) {

  }

  @Get(':id')
  async get(
    @Param('id') id: string,
  ) {

  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ) {

  }

  @Patch(':id')
  async patch(
    @Param('id') id: string,
    @Body() dto: ProductModele,
  ) {

  }

  @Post('find')
  @HttpCode(200)
  async find(
    @Body() dto: FindProductDto,
  ) {
    
  }
}
