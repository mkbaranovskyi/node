import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrderDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/orders')
  createOrder(@Body() dto: CreateOrderDto) {
    console.log('GATEWAY: create oder:', dto);
    return this.appService.createOrder(dto);
  }
}
