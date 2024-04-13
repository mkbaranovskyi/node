import { Body, Controller, Get, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { CreateUserDto } from './dto'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.appService.createUser(dto)
  }

  @Get('/analytics')
  getAnalytics() {
    return this.appService.getAnalytics()
  }
}
